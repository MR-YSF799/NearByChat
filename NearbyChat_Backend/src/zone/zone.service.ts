import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Zone } from './zone.entity';

@Injectable()
export class ZoneService {
  private userLocations = new Map<string, { lat: number; lon: number; timestamp: number }>();

  constructor(
    @InjectRepository(Zone)
    private readonly zoneRepository: Repository<Zone>,
  ) {}

  /**
   * Trouve la zone correspondant à une position GPS (latitude, longitude).
   * Si aucune zone n'existe à cet endroit, elle est créée dynamiquement.
   */
  async resolveZone(latitude: number, longitude: number, userId?: string): Promise<Zone | null> {
    
    if (userId) {
      if (!this.validateSpeed(userId, latitude, longitude)) {
        throw new BadRequestException('Vitesse trop élevée - coordonnées invalides');
      }
      this.userLocations.set(userId, { lat: latitude, lon: longitude, timestamp: Date.now() });
    }

    let zone = await this.zoneRepository
      .createQueryBuilder('zone')
      .where("ST_Contains(zone.polygon, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326))", {
        lon: longitude,
        lat: latitude,
      })
      .getOne();

    if (!zone) {
      const step = 0.01;
      const baseLat = Math.floor(latitude / step) * step;
      const baseLon = Math.floor(longitude / step) * step;
      const genName = `Zone ${Math.abs(baseLat).toFixed(2)},${Math.abs(baseLon).toFixed(2)}`;

      zone = await this.zoneRepository.findOne({ where: { name: genName } });
      
      if (!zone) {
        const colors = ['#0A84FF', '#4ECDC4', '#FFE66D', '#A8E6CF', '#FF8A5B', '#8338EC'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        const newZone = this.zoneRepository.create({
          name: genName,
          color: randomColor,
          polygon: {
            type: 'Polygon' as const,
            coordinates: [
              [
                [baseLon, baseLat],
                [baseLon + step, baseLat],
                [baseLon + step, baseLat + step],
                [baseLon, baseLat + step],
                [baseLon, baseLat]
              ]
            ]
          },
        });
        zone = await this.zoneRepository.save(newZone);
      }
    }

    return zone;
  }

  /**
   * Récupère toutes les zones avec le nombre d'utilisateurs connectés.
   */
  async getAllZonesWithUserCount(activeUsersByZone: Record<string, number> = {}): Promise<any[]> {
    const zones = await this.zoneRepository.find();
    return zones.map(zone => ({
      ...zone,
      userCount: activeUsersByZone[zone.id] || 0,
    }));
  }

  /**
   * Vérifie la vitesse de déplacement : rejette si > 200 km/h.
   * Empêche les utilisateurs de "téléporter" leur position GPS.
   */
  private validateSpeed(userId: string, newLat: number, newLon: number): boolean {
    const lastLocation = this.userLocations.get(userId);
    if (!lastLocation) return true; 

    const timeDiff = (Date.now() - lastLocation.timestamp) / 1000;
    if (timeDiff === 0) return true;

    const distanceMeters = this.getDistanceFromLatLonInM(
      lastLocation.lat,
      lastLocation.lon,
      newLat,
      newLon,
    );

    const speedKmh = (distanceMeters / 1000) / (timeDiff / 3600);
    return speedKmh <= 200;
  }

  /**
   * Formule de Haversine pour calculer la distance entre deux points GPS.
   * C'est une formule mathématique qui prend en compte la courbure de la Terre.
   */
  private getDistanceFromLatLonInM(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371e3;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }
}
