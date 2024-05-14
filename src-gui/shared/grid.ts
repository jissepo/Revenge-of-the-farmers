import { BaseGameGridCellCoordinates } from '../types/worker/grid';

export const GRID_MAX_WIDTH = 9;
export const GRID_MAX_HEIGHT = 7;

export const calculateGridCellIndexForCell = (cell: BaseGameGridCellCoordinates): number => calculateGridCellIndex(cell.x, cell.y);

export const calculateGridCellIndex = (x: number, y: number): number => y * GRID_MAX_WIDTH + x;
