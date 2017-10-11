import { Injectable } from '@angular/core';
import { AcNotification, ActionType } from 'angular-cesium';
import { GameConfig } from './game-config';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class BuildingsService {

  private buildings$ = new Subject<AcNotification>();
  private counter = 0;

  constructor() {
  }

  private generateId(): string {
    return 'tileBuilding-' + this.counter++;
  }

  getBuildings(): Subject<AcNotification> {
    return this.buildings$;
  }

  createBuilding(position: Cartesian3): any {
    const center: any = Cesium.Cartographic.fromCartesian(position);
    center.latitude = Cesium.Math.toDegrees(center.latitude);
    center.longitude = Cesium.Math.toDegrees(center.longitude);
    const id = this.generateId();
    const buildingHeight = GameConfig.buildingHeight;
    const wallSize = GameConfig.wallSize;
    const wallOnWindowSides = GameConfig.wallOnWindowSides;
    const windowHeightFromGround = GameConfig.windowHeightFromGround;
    const windowHeight = GameConfig.windowHeight;
    const roomOffset = wallSize / 2;
    const building = {
      id,
      wallsPositions: Cesium.Cartesian3.fromDegreesArrayHeights([
        center.longitude - roomOffset, center.latitude - roomOffset, buildingHeight,
        center.longitude - roomOffset, center.latitude + roomOffset, buildingHeight,
        center.longitude + roomOffset, center.latitude + roomOffset, buildingHeight,
        center.longitude + roomOffset, center.latitude - roomOffset, buildingHeight,
        center.longitude - roomOffset, center.latitude - roomOffset, buildingHeight
      ]),
      lowerWallsMaxHeights: [
        windowHeightFromGround,
        windowHeightFromGround,
        windowHeightFromGround,
        windowHeightFromGround,
        windowHeightFromGround
      ],
      upperWallsMinHeights: [
        windowHeightFromGround + windowHeight,
        windowHeightFromGround + windowHeight,
        windowHeightFromGround + windowHeight,
        windowHeightFromGround + windowHeight,
        windowHeightFromGround + windowHeight,
      ],
      southEastWallsPositions: Cesium.Cartesian3.fromDegreesArrayHeights([
        center.longitude + roomOffset, center.latitude - roomOffset + wallOnWindowSides, buildingHeight,
        center.longitude + roomOffset, center.latitude - roomOffset, buildingHeight,
        center.longitude + roomOffset - wallOnWindowSides, center.latitude - roomOffset, buildingHeight,
      ]),
      southWestWallsPositions: Cesium.Cartesian3.fromDegreesArrayHeights([
        center.longitude - roomOffset + wallOnWindowSides, center.latitude - roomOffset, buildingHeight,
        center.longitude - roomOffset, center.latitude - roomOffset, buildingHeight,
        center.longitude - roomOffset, center.latitude - roomOffset + wallOnWindowSides, buildingHeight,
      ]),
      northEastWallsPositions: Cesium.Cartesian3.fromDegreesArrayHeights([
        center.longitude + roomOffset - wallOnWindowSides, center.latitude + roomOffset, buildingHeight,
        center.longitude + roomOffset, center.latitude + roomOffset, buildingHeight,
        center.longitude + roomOffset, center.latitude + roomOffset - wallOnWindowSides, buildingHeight,
      ]),
      northWestWallsPositions: Cesium.Cartesian3.fromDegreesArrayHeights([
        center.longitude - roomOffset, center.latitude + roomOffset - wallOnWindowSides, buildingHeight,
        center.longitude - roomOffset, center.latitude + roomOffset, buildingHeight,
        center.longitude - roomOffset + wallOnWindowSides, center.latitude + roomOffset, buildingHeight,
      ]),
      ceiling: Cesium.Cartesian3.fromDegreesArrayHeights([
        center.longitude - roomOffset, center.latitude - roomOffset, buildingHeight,
        center.longitude - roomOffset, center.latitude + roomOffset, buildingHeight,
        center.longitude + roomOffset, center.latitude + roomOffset, buildingHeight,
        center.longitude + roomOffset, center.latitude - roomOffset, buildingHeight,
      ]),
    };
    this.buildings$.next({ id, entity: building, actionType: ActionType.ADD_UPDATE });
    return building;
  }

  removeBuilding(id) {
    this.buildings$.next({ id, actionType: ActionType.DELETE });
  }
}