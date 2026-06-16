export class AssetManager {
  private images: Map<string, HTMLImageElement> = new Map();
  private loadedCount = 0;

  private assetsToLoad = [
    { key: 'player_idle', url: '/new assets/Characters/character_beige_idle.png' },
    { key: 'player_walk1', url: '/new assets/Characters/character_beige_walk_a.png' },
    { key: 'player_walk2', url: '/new assets/Characters/character_beige_walk_b.png' },
    { key: 'player_jump', url: '/new assets/Characters/character_beige_jump.png' },
    
    { key: 'enemy_walk1', url: '/new assets/Enemies/slime_normal_walk_a.png' },
    { key: 'enemy_walk2', url: '/new assets/Enemies/slime_normal_walk_b.png' },
    { key: 'air_enemy1', url: '/new assets/Enemies/fly_a.png' },
    { key: 'air_enemy2', url: '/new assets/Enemies/fly_b.png' },
    { key: 'boss', url: '/new assets/Enemies/slime_fire_walk_a.png' },
    
    { key: 'platform', url: '/new assets/Tiles/terrain_grass_block.png' },
    { key: 'brick', url: '/new assets/Tiles/block_yellow.png' },
    { key: 'item_block', url: '/new assets/Tiles/block_coin.png' },
    
    { key: 'coin', url: '/new assets/Tiles/coin_gold.png' },
    { key: 'bomb', url: '/new assets/Tiles/bomb.png' },
    { key: 'heart', url: '/new assets/Tiles/heart.png' },
    { key: 'gem', url: '/new assets/Tiles/gem_blue.png' },
    { key: 'ufo', url: '/new assets/Tiles/ufo_5818206.png' },
    
    { key: 'bg_sky', url: '/new assets/Backgrounds/background_solid_sky.png' },
    { key: 'bg_clouds', url: '/new assets/Backgrounds/background_clouds.png' }
  ];

  async loadAll(): Promise<void> {
    const promises = this.assetsToLoad.map(asset => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.src = import.meta.env.BASE_URL + asset.url.substring(1);
        img.onload = () => {
          this.images.set(asset.key, img);
          this.loadedCount++;
          resolve();
        };
        img.onerror = () => {
          console.error(`Failed to load asset: ${asset.url}`);
          reject(new Error(`Failed to load asset: ${asset.url}`));
        };
      });
    });

    await Promise.all(promises);
  }

  get(key: string): HTMLImageElement {
    const img = this.images.get(key);
    if (!img) {
      throw new Error(`Asset not found for key: ${key}`);
    }
    return img;
  }

  getProgress(): number {
    return this.loadedCount / this.assetsToLoad.length;
  }
}
