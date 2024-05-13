export class PetInfo {
  id: string;
  name: string;
  imageUrl: string;
  verification: {
    mealCount: number;
    walkCount: number;
    bathCount: number;
    treatCount: number;
  };
}
