let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let size = 0;
let ui_size = 0;

let player;
let plr_s = {
    speed: 0.3,
    angle: 0,
    t_angle: 0,
    size: 25,
    color: "red",
    smasher: true,
    reload: 1,
    bullet_health: 1,
    type: 0,
};

let score = 0
let score_bar_size_x = 0

let scroll_s = {
    x: 0,
    y: 0,
};

let bg = {
    x: 0,
    y: 0,
}

let border = 5;

let mouseDown = false;
let keys = [];

let plr_barrels = [];

let bullets = [];
let shapes = [];
let bots = []

let logo = new Image(50, 50)
logo.src = "logo.png"

window.addEventListener("keydown", function(event) {
    keys[event.key] = true;
});
window.addEventListener("keyup", function(event) {
    keys[event.key] = false;
});

window.addEventListener("click", function(event) {
    if (
        event.clientX < ui_size * 110 &&
        event.clientX > ui_size * 10 &&
        event.clientY < ui_size * 110 &&
        event.clientY > ui_size * 10) {
        if (plr_s.type < 5) {
            plr_s.type += 1;
        } else {
            plr_s.type = 0;
        };

        if (plr_s.type == 0) {
            delete_barrels()
            plr_s.smasher = false

            plr_barrels.push(new Barrel(0, 0, plr_s.reload, 2, 1))
        } else if (plr_s.type == 1) {
            delete_barrels()
            plr_s.smasher = false

            plr_barrels.push(new Barrel(0, 0, plr_s.reload, 1.4, 1))
        } else if (plr_s.type == 2) {
            delete_barrels()
            plr_s.smasher = false

            plr_barrels.push(new Barrel(-10, 0, plr_s.reload * 2.1, 1.5, 1))
            plr_barrels.push(new Barrel(10, 0, plr_s.reload * 2.2, 1.5, 1))
            plr_barrels.push(new Barrel(0, 0, plr_s.reload, 2, 1))
        } else if (plr_s.type == 3) {
            delete_barrels()
            plr_s.smasher = true
        } else if (plr_s.type == 4) {
            delete_barrels()
            plr_s.smasher = false

            for (let i = 0; i < 1; i += 0.2) {
                plr_barrels.push(new Barrel(0, 0, plr_s.reload * ((1 - i) + 2), (1 - i) + 1.1, 1))
            }
        } else if (plr_s.type == 5) {
            delete_barrels()
            plr_s.smasher = true

            plr_barrels.push(new Barrel(0, 0, plr_s.reload, 1.4, 1))
        }
    };

    if (
        event.clientX < ui_size * 220 &&
        event.clientX > ui_size * 110 &&
        event.clientY < ui_size * 110 &&
        event.clientY > ui_size * 10) {
        plr_s.reload += 0.25
    };

    if (
        event.clientX < ui_size * 110 &&
        event.clientX > ui_size * 10 &&
        event.clientY < ui_size * 220 &&
        event.clientY > ui_size * 120) {
        plr_s.color = "yellow"
        plr_s.size = 80
        plr_s.reload = 2
        plr_s.bullet_health = 7
    };

    /*if (
        event.clientX < ui_size * 220 &&
        event.clientX > ui_size * 110 &&
        event.clientY < ui_size * 220 &&
        event.clientY > ui_size * 120) {
        bots.push(new Bot(500 * size, 500 * size))
    };*/
});
window.addEventListener("mousedown", function(event) {
    mouseDown = true;
});
window.addEventListener("mouseup", function(event) {
    mouseDown = false;
});
window.addEventListener("mousemove", function(event) {
    plr_s.t_angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2) - 90 * Math.PI / 180;
});

window.addEventListener("resize", function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

function setup() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    for (let i = 0; i < 20; i += 1) {
        shapes.push(new Shape(Math.random() * 1000, Math.random() * 1000, Math.floor(Math.random() * 3)));
    }

    let color = Math.floor(Math.random() * 3)
    if (color == 0) {
        plr_s.color = "lime"
    } else if (color == 1) {
        plr_s.color = "cyan"
    } else {
        plr_s.color = "#FF41EE"
    }

    player = new Player(0, 0)
};
function draw() {
    score_bar_size_x += ((score / 1000) - score_bar_size_x) * 0.15

    size = (canvas.width / 2 + canvas.height / 2) / 1000
    ui_size = (canvas.width / 2 + canvas.height / 2) / 1000

    size -= (((plr_s.size - 100) * ui_size) / 200)

    ctx.save()


    ctx.restore()

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    background(25)

    for (let i = 0; i < bullets.length; i += 1) {
        if (bullets[i].del == true) {
            bullets.splice(i, 1);
        } else {
            bullets[i].draw();
        };
    };

    for (let i = 0; i < shapes.length; i += 1) {
        if (shapes[i].del == true) {
            shapes.splice(i, 1);
            shapes.push(new Shape(Math.random() * 1000, Math.random() * 1000, Math.floor(Math.random() * 3)));
        } else {
            shapes[i].draw();
        };
    };

    ctx.globalAlpha = 1;

    player.draw();
    player.move();

    for (let i = 0; i < bots.length; i += 1) {
        if (bots[i].del == true) {
            bots.splice(i, 1);
        } else {
            bots[i].draw();
        };
    };

    UI();
};


function UI() {
    draw_button(10, 10, 1, 60, "Change type", "#5AFF82")
    draw_button(120, 10, 3, 60, "More reload", "cyan")
    draw_button(10, 120, -10, 60, "Be arena closer", "red")
    //draw_button(120, 120, -10, 60, "Spawn dominator", "blue")
    score_bar()

    ctx.save()

    ctx.translate(window.innerWidth, window.innerHeight)

    ctx.globalAlpha = 0.5
    ctx.drawImage(logo, -100 * ui_size, -100 * ui_size, 100 * ui_size, 100 * ui_size)

    ctx.restore()
};

function score_bar() {
    ctx.save()

    ctx.translate(canvas.width / 2, canvas.height)

    ctx.beginPath()

    ctx.rect(-150 * ui_size, -50 * ui_size, 300 * ui_size, 20 * ui_size)
    ctx.strokeStyle = "black"
    ctx.lineWidth = border * ui_size
    ctx.fillStyle = "#323232"
    ctx.stroke()
    ctx.fill()

    ctx.beginPath()

    ctx.rect(-150 * ui_size, -50 * ui_size, score_bar_size_x * 300 * ui_size, 20 * ui_size)
    ctx.fillStyle = "lime"
    ctx.fill()

    ctx.closePath()

    ctx.fillStyle = "white"
    ctx.strokeStyle = "black"
    ctx.font = ui_size * 25 + "px Agency FB"
    ctx.lineWidth = border * ui_size
    ctx.strokeText(score + " / 1000", -25 * ui_size, -30 * ui_size)
    ctx.fillText(score + " / 1000", -25 * ui_size, -30 * ui_size)

    ctx.restore()
}

function draw_button(x, y, x_offset, y_offset, text, color) {
    ctx.save()

    ctx.beginPath()
    ctx.globalAlpha = 1;
    ctx.rect(ui_size * x, y * ui_size, ui_size * 100, ui_size * 100)
    ctx.fillStyle = color
    ctx.fill()

    ctx.beginPath()
    ctx.rect(ui_size * x, (ui_size * 50) + (y * ui_size), ui_size * 100, ui_size * 50)
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = "black"
    ctx.fill()

    ctx.beginPath()
    ctx.globalAlpha = 1;
    ctx.rect(x * ui_size, y * ui_size, ui_size * 100, ui_size * 100)
    ctx.lineWidth = border / 1.5 * ui_size
    ctx.stroke()

    ctx.fillStyle = "white"
    ctx.font = ui_size * 25 + "px Agency FB"
    ctx.strokeText(text, (x * ui_size) + (ui_size * x_offset), (y * ui_size) + (ui_size * y_offset))
    ctx.fillText(text, (x * ui_size) + (ui_size * x_offset), (y * ui_size) + (ui_size * y_offset))

    ctx.restore()
};


function background(scale) {
    ctx.save()

    ctx.translate(-scroll_s.x * size, -scroll_s.y * size)
    ctx.rotate(0)

    ctx.beginPath()
    ctx.rect(0, 0, 1000 * size, 1000 * size)
    ctx.fillStyle = "#DCDCDC"
    ctx.fill()

    ctx.restore()

    ctx.save();

    ctx.translate((-bg.x - scale) * size, (-bg.y - scale) * size);
    ctx.rotate(0);

    if (bg.x * size > scale * size) {
        bg.x = 0
    } else if (bg.x * size < -scale * size) {
        bg.x = scale
    }

    if (bg.y * size > scale * size) {
        bg.y = 0
    } else if (bg.y * size < -scale * size) {
        bg.y = scale
    }

    ctx.beginPath();
    for (let i = 0; i < 75; i += 1) {
        for (let o = 0; o < 75; o += 1) {
            ctx.rect(i * scale * size, o * scale * size, scale * size, scale * size);
        };
    };
    ctx.lineWidth = border / 2 * size;
    ctx.globalAlpha = 0.01;
    ctx.strokeStyle = "black"
    ctx.stroke();

    ctx.restore();
};


function delete_barrels() {
    plr_barrels.splice(0, plr_barrels.length)
}


function healthBar(health) {
    ctx.save()

    ctx.beginPath()
    ctx.rect(-25, 25, 50, 25)
    ctx.lineWidth = border * size
    ctx.fillStyle = "black"
    ctx.fill()
    ctx.stroke()

    ctx.restore()
};

class Player {
    constructor() {
        this.reload = plr_s.reload; 
        this.reload_time = 0;
        this.speed_x = 0;
        this.speed_y = 0;
        this.spin = 0
    };
    draw() {
        if (plr_s.smasher == true) {
            this.spin += 0.03
            ctx.save()

            ctx.translate(canvas.width / 2, canvas.height / 2)
            ctx.rotate(this.spin)

            polygon(0, 0, plr_s.size * 1.3 * size, 6)
            ctx.fillStyle = "#323232"
            ctx.lineWidth = size * border / 2
            ctx.fill()
            ctx.stroke()

            ctx.restore()
        }

        this.reload = plr_s.reload; 

        ctx.save();

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(plr_s.angle);

        plr_s.angle = plr_s.t_angle
    
        ctx.lineWidth = border * size

        for (let i = 0; i < plr_barrels.length; i += 1) {
            plr_barrels[i].draw(plr_s.reload, plr_s.size)
        }

        ctx.beginPath();
        ctx.arc(0, 0, plr_s.size * size, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = plr_s.color;
        ctx.fill();
    
        ctx.restore();
    };

    move() {
        this.reload_time += 0.1
        scroll_s.x += this.speed_x;
        bg.x += this.speed_x;
        scroll_s.y += this.speed_y;
        bg.y += this.speed_y;
        this.speed_x *= 0.9;
        this.speed_y *= 0.9;
        if (this.reload_time > 10 / this.reload) {
            this.reload_time = 0;
        };

        if (scroll_s.x * size > ((600 * size))) {
            this.speed_x -= 2
        }
        if (scroll_s.x * size < -((550 * size))) {
            this.speed_x += 2
        }
        if (scroll_s.y * size > ((800 * size))) {
            this.speed_y -= 2
        }
        if (scroll_s.y * size < -((300 * size))) {
            this.speed_y += 2
        }

        if (keys["a"] == true || keys["ArrowLeft"] == true) {
            this.speed_x -= plr_s.speed;
        };
        if (keys["d"] == true || keys["ArrowRight"] == true) {
            this.speed_x += plr_s.speed;
        };
        if (keys["w"] == true || keys["ArrowUp"] == true) {
            this.speed_y -= plr_s.speed;
        };
        if (keys["s"] == true || keys["ArrowDown"] == true) {
            this.speed_y += plr_s.speed;
        };
    };
};


class Bullet {
    constructor(x, y, health, angle, color) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.color = color;
        this.del = false;
        this.del_time = 0;
        this.health = health
        this.max_health = health
    };

    draw() {
        ctx.globalAlpha = (7 - this.del_time) / 7;
        this.del_time += 0.1;
        if (this.del_time > 7) {
            this.del = true;
        };
        if (this.health <= 0) {
            this.del = true
        }

        this.x += Math.cos(this.angle + 90 * Math.PI / 180) * (3 + (plr_s.size / 10));
        this.y += Math.sin(this.angle + 90 * Math.PI / 180) * (3 + (plr_s.size / 10));

        ctx.save();

        ctx.lineWidth = border / 2 * size

        ctx.translate(this.x * size + canvas.width / 2 - scroll_s.x * size, this.y * size + canvas.height / 2 - scroll_s.y * size)
        ctx.rotate(0)

        ctx.beginPath();
        ctx.arc(0, 0, plr_s.size * size / 2, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    };
};


class Shape {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.vel_x = 0;
        this.vel_y = 0;
        this.angle = Math.random() * 180 * Math.PI / 180;
        this.type = type;
        this.health = 0; 
        this.rot_speed = Math.floor((Math.random() - 0.5) * 4);
        this.max_health = 0;
        this.damaged = false;
        if (this.type == 0) {
            this.health = 2;
            this.max_health = 2;
        } else if (this.type == 1) {
            this.health = 4;
            this.max_health = 4;
        } else {
            this.health = 8;
            this.max_health = 8;
        };
        this.del = false;
    };

    draw() {
        this.damaged = false
        this.angle += this.rot_speed / 100

        this.x += this.vel_x
        this.y += this.vel_y
        this.vel_x /= 1.1
        this.vel_y /= 1.1

        let x = (this.x - scroll_s.x) * size;
        let y = (this.y - scroll_s.y) * size;

        if (this.health <= 0) {
            this.del = true;
            plr_s.size += 0.1
            if (this.type == 0) {
                score += 1
            } else if (this.type == 1) {
                score += 2
            } else {
                score += 4
            }
        };

        for (let i = 0; i < bullets.length; i += 1) {
            let bx = (bullets[i].x - scroll_s.x) * size + canvas.width / 2;
            let by = (bullets[i].y - scroll_s.y) * size + canvas.height / 2;

            if (
                bx - (plr_s.size / 2) * size < x &&
                bx + (plr_s.size / 2) * size > x &&
                by - (plr_s.size / 2) * size < y &&
                by + (plr_s.size / 2) * size > y
            ) {
                this.vel_x += Math.cos(bullets[i].angle + (90 * Math.PI / 180)) * 2
                this.vel_y += Math.sin(bullets[i].angle + (90 * Math.PI / 180)) * 2
                this.damaged = true
                this.health -= 1;
                bullets[i].health -= 1
            };
        };

        if (
            x < (canvas.width / 2) + (plr_s.size * size) &&
            x > (canvas.width / 2) + (plr_s.size * size) / 4 &&
            y < (canvas.height / 2) + (plr_s.size * size) &&
            y > (canvas.height / 2) - (plr_s.size * size)
        ) {
            this.vel_x += 1
            player.speed_x -= 1.5
            if (plr_s.smasher == false) {
                this.health -= 0.1
            } else {
                this.health -= 0.23
            }
        }
        if (
            x < (canvas.width / 2) - (plr_s.size * size) / 4 &&
            x > (canvas.width / 2) - (plr_s.size * size) &&
            y < (canvas.height / 2) + (plr_s.size * size) &&
            y > (canvas.height / 2) - (plr_s.size * size)
        ) {
            this.vel_x -= 1
            player.speed_x += 1.5
            if (plr_s.smasher == false) {
                this.health -= 0.1
            } else {
                this.health -= 0.23
            }
        }
        if (
            x < (canvas.width / 2) + (plr_s.size * size) &&
            x > (canvas.width / 2) - (plr_s.size * size) &&
            y < (canvas.height / 2) + (plr_s.size * size) &&
            y > (canvas.height / 2) + (plr_s.size * size) / 4
        ) {
            this.vel_y += 1
            player.speed_y -= 1.5
            if (plr_s.smasher == false) {
                this.health -= 0.1
            } else {
                this.health -= 0.23
            }
        }
        if (
            x < (canvas.width / 2) + (plr_s.size * size) &&
            x > (canvas.width / 2) - (plr_s.size * size) &&
            y < (canvas.height / 2) - (plr_s.size * size) / 4 &&
            y > (canvas.height / 2) - (plr_s.size * size)
        ) {
            this.vel_y -= 1
            player.speed_y += 1.5
            if (plr_s.smasher == false) {
                this.health -= 0.1
            } else {
                this.health -= 0.23
            }
        }

        ctx.save();

        ctx.translate(((this.x - scroll_s.x) * size), ((this.y - scroll_s.y) * size));
        ctx.rotate(this.angle);

        ctx.globalAlpha = 1;
        ctx.lineWidth = border * size

        if (this.type == 0) {        
            polygon(0, 0, size * 25, 4);
            if (this.damaged == false) {
                ctx.fillStyle = "yellow";
            } else {
                ctx.fillStyle = "red";
            }
            ctx.stroke();
            ctx.fill();
        } else if (this.type == 1) {
            polygon(0, 0, size * 25, 3);
            if (this.damaged == false) {
                ctx.fillStyle = "salmon";
            } else {
                ctx.fillStyle = "red";
            }
            ctx.stroke();
            ctx.fill();
        } else {
            polygon(0, 0, size * 30, 5);
            if (this.damaged == false) {
                ctx.fillStyle = "#5A64FF";
            } else {
                ctx.fillStyle = "red"
            }
            ctx.stroke();
            ctx.fill();
        };

        ctx.restore();
    };
};

class Barrel {
    constructor(x_offset, angle, reload, height, power) {
        this.angle = angle
        this.reload = 0
        this.x = x_offset
        this.t_reload = reload
        this.reload_time = 0
        this.size_y = height
        this.t_size_y = height
        this.power = power
    }

    draw(reload, t_size) {
        this.size_y += (this.t_size_y - this.size_y) * 0.1

        this.reload = reload + this.t_reload

        this.reload_time += 0.1

        if (this.reload_time > 10 / this.reload) {
            this.reload_time = 0
        }

        if (
            mouseDown == true && 
            this.reload_time > 10 / this.reload - 0.1
        ) {
            player.speed_x -= Math.cos(plr_s.angle + ((90 + this.angle) * Math.PI / 180)) * (this.power / 2)
            player.speed_y -= Math.sin(plr_s.angle + ((90 + this.angle) * Math.PI / 180)) * (this.power / 2)

            this.size_y = this.t_size_y - 0.1
            bullets.push(new Bullet(
                scroll_s.x + (Math.cos(plr_s.angle + (90 + this.angle) * Math.PI / 180) * (plr_s.size + (this.t_size_y * 4))) + (Math.cos(plr_s.angle) * this.x * (plr_s.size / 25)), 
                scroll_s.y + (Math.sin(plr_s.angle + (90 + this.angle) * Math.PI / 180) * (plr_s.size + (this.t_size_y * 4))) + (Math.sin(plr_s.angle) * this.x * (plr_s.size / 25)), 
                plr_s.bullet_health, plr_s.angle + this.angle * Math.PI / 180, plr_s.color));
        };
    
        ctx.save();
    
        ctx.translate(this.x * size * (plr_s.size / 25), 0);
        ctx.rotate(this.angle * Math.PI / 180);
    
        ctx.beginPath();
    
        ctx.rect(-t_size * size / (1.25 * 2), 0, t_size / 1.25 * size, t_size * size * this.size_y);
    
        ctx.lineWidth = border * size
        ctx.stroke();
        ctx.fillStyle = "gray";
        ctx.fill();
    
        ctx.restore();
    }
}


class Bot {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.barrels = []
        this.reload = 2

        this.barrels.push(new Barrel(0, 0, this.reload, 2, 1))
    }

    draw() {
        ctx.save()

        ctx.translate((this.x - scroll_s.x) * size, (this.y - scroll_s.y) * size)
        ctx.rotate(0)

        for (let i = 0; i < this.barrels.length; i += 1) {
            this.barrels[i].draw(this.reload, 30)
        }

        ctx.beginPath()
        ctx.arc(0, 0, 30 * size, 0, 2 * Math.PI)
        ctx.fillStyle = "red"
        ctx.lineWidth = border / 2 * size
        ctx.fill()
        ctx.stroke()

        ctx.restore()
    }
}


function polygon(x, y, radius, points) {
    let angle = 360 * Math.PI / 180
    ctx.beginPath();
    for (let i = 0; i < angle + 3; i += angle / points) {
        ctx.lineTo(x + Math.cos(i) * radius, y + Math.sin(i) * radius)
    };
};

setup();
window.setInterval(draw, 1000 / 60);