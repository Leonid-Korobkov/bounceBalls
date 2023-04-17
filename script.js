const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const width = (canvas.width = window.innerWidth)
const height = (canvas.height = window.innerHeight)
const p = document.querySelector('p')

function random(min, max) {
  let randomNum = Math.floor(Math.random() * (max - min + 1)) + min
  return randomNum ? randomNum : random(min, max)
}

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`
}

class Shape {
  constructor(x, y, velX, velY) {
    this.x = x
    this.y = y
    this.velX = velX
    this.velY = velY
  }
}

class Ball extends Shape {
  constructor(x, y, velX, velY, color, size) {
    super(x, y, velX, velY)
    this.color = color
    this.size = size
  }

  draw() {
    ctx.beginPath()
    ctx.fillStyle = this.color
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
    ctx.fill()
  }

  update() {
    if (this.x + this.size >= width) {
      this.velX = -this.velX
    }

    if (this.x - this.size <= 0) {
      this.velX = -this.velX
    }

    if (this.y + this.size >= height) {
      this.velY = -this.velY
    }

    if (this.y - this.size <= 0) {
      this.velY = -this.velY
    }

    this.x += this.velX
    this.y += this.velY
  }

  collisionDetect() {
    for (const ball of balls) {
      if (!(this === ball) && ball.exists) {
        const dx = this.x - ball.x
        const dy = this.y - ball.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < this.size + ball.size) {
          ball.color = this.color = randomRGB()
        }
      }
    }
  }
}

class EvilCircle extends Shape {
  constructor(x, y) {
    super(x, y, 20, 20)
    this.color = '#fff'
    this.size = 10
  }

  draw() {
    ctx.beginPath()
    ctx.lineWidth = 3
    ctx.strokeStyle = this.color
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
    ctx.stroke()
  }

  checkBounds() {
    if (this.x + this.size >= width) {
      this.x = -this.x
    }

    if (this.x - this.size <= 0) {
      this.x = -this.x
    }

    if (this.y + this.size >= height) {
      this.y = -this.y
    }

    if (this.y - this.size <= 0) {
      this.y = -this.y
    }
  }

  collisionDetect() {
    balls.forEach((ball, index) => {
      if (!(this === ball)) {
        const dx = this.x - ball.x
        const dy = this.y - ball.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < this.size + ball.size) {
          balls.splice(index, 1)
          p.textContent = `Счетчик мячей: ${balls.length}`
        }
      }
    })
  }
}

const balls = []
while (balls.length < 25) {
  const size = random(10, 20)
  const ball = new Ball(random(0 + size, width - size), random(0 + size, height - size), random(-15, 15), random(-15, 15), randomRGB(), size)
  balls.push(ball)
  p.textContent = `Счетчик мячей: ${balls.length}`
}

const evilBall = new EvilCircle(random(0 + 10, width - 10), random(0 + 10, height - 10))

;(function loop() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
  ctx.fillRect(0, 0, width, height)

  for (const ball of balls) {
    ball.draw()
    ball.update()
    ball.collisionDetect()
  }

  evilBall.draw()
  evilBall.checkBounds()
  evilBall.collisionDetect()

  requestAnimationFrame(loop)
})()

window.addEventListener('keydown', e => {
  switch (e.key) {
    case 'a':
      this.x -= this.velX
      break
    case 'd':
      this.x += this.velX
      break
    case 'w':
      this.y -= this.velY
      break
    case 's':
      this.y += this.velY
      break
  }
})
