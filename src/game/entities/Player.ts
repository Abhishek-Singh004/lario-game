export enum PlayerState {
  IDLE,
  RUNNING,
  JUMPING,
  FALLING,
  DEAD
}

export class Player {
  x: number;
  y: number;
  width: number;
  height: number;
  
  vx: number;
  vy: number;
  
  // Physics constants
  speed: number = 200;
  jumpForce: number = -450; // negative is up
  gravity: number = 1200;
  maxFallSpeed: number = 600;
  friction: number = 0.8; // for sliding
  
  state: PlayerState;
  
  // Advanced Game Feel
  isGrounded: boolean;
  coyoteTimer: number;
  coyoteTimeMax: number = 0.1; // 100ms
  jumpBufferTimer: number;
  jumpBufferMax: number = 0.1; // 100ms
  
  jumpHeld: boolean = false;
  justJumped: boolean = false; // Flag to trigger sound
  
  facingRight: boolean = true;

  jumpTimer: number = 0;
  maxJumpTime: number = 0.3;
  isDashing: boolean = false;
  dashMultiplier: number = 1.6;
  
  isInvincible: boolean = false;
  invincibleTimer: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.width = 48;
    this.height = 64;
    this.vx = 0;
    this.vy = 0;
    this.state = PlayerState.IDLE;
    this.isGrounded = false;
    this.coyoteTimer = 0;
    this.jumpBufferTimer = 0;
  }

  update(deltaTime: number, inputX: number, jumpPressed: boolean, jumpHeld: boolean, dashHeld: boolean) {
    this.justJumped = false;

    if (this.state === PlayerState.DEAD) {
      this.vy += this.gravity * deltaTime;
      return; 
    }

    this.jumpHeld = jumpHeld;
    this.isDashing = dashHeld;

    // Jump Buffering
    if (jumpPressed) {
      this.jumpBufferTimer = this.jumpBufferMax;
    } else {
      this.jumpBufferTimer -= deltaTime;
    }

    // Coyote Time
    if (this.isGrounded) {
      this.coyoteTimer = this.coyoteTimeMax;
    } else {
      this.coyoteTimer -= deltaTime;
    }

    if (this.jumpTimer > 0) {
      this.jumpTimer -= deltaTime;
    }

    if (this.isInvincible) {
        this.invincibleTimer -= deltaTime;
        if (this.invincibleTimer <= 0) {
            this.isInvincible = false;
        }
    }

    // Handle Jump Initiation
    if (this.jumpBufferTimer > 0 && this.coyoteTimer > 0) {
      this.vy = this.jumpForce;
      this.jumpBufferTimer = 0;
      this.coyoteTimer = 0;
      this.isGrounded = false;
      this.state = PlayerState.JUMPING;
      this.justJumped = true;
      this.jumpTimer = this.maxJumpTime; // Give fuel
    }

    // Variable Jump Height / Ascending
    if (this.jumpHeld && this.jumpTimer > 0) {
       this.vy = this.jumpForce; // Sustain upward velocity
       this.jumpTimer -= deltaTime;
    } else {
       this.jumpTimer = 0; // Cut jump fuel if released early
    }

    // Horizontal Movement
    const currentSpeed = this.isDashing ? this.speed * this.dashMultiplier : this.speed;

    if (inputX !== 0) {
      this.vx = inputX * currentSpeed;
      this.facingRight = inputX > 0;
      if (this.isGrounded) this.state = PlayerState.RUNNING;
    } else {
      this.vx *= this.friction;
      if (Math.abs(this.vx) < 5) this.vx = 0;
      if (this.isGrounded && this.vx === 0) this.state = PlayerState.IDLE;
    }

    // Apply Gravity (only if not currently sustaining a jump)
    if (this.jumpTimer <= 0) {
       this.vy += this.gravity * deltaTime;
       if (this.vy > this.maxFallSpeed) this.vy = this.maxFallSpeed;
    }

    // Determine vertical state
    if (!this.isGrounded) {
      if (this.vy > 0) this.state = PlayerState.FALLING;
      else this.state = PlayerState.JUMPING;
    }
  }

  die() {
    this.state = PlayerState.DEAD;
    this.vy = -300; // Little pop up on death
    this.vx = 0;
  }
}
