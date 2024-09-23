function makeArray(cols, rows)
{
    var arr = new Array(cols);
    
    for (var x = 0; x < arr.length; x++)
    {
        arr[x] = new Array(rows);
    }
    return arr;
}

function Cell(a, b, w)
{
    this.a = a;
    this.b = b;
    this.x = a*w;
    this.y = b*w;
    this.w = w;
    this.neighbor = 0;
    this.revealed = false;
    this.bee = false;
}

function gameOver()
{
    for (var x = 0; x < cols; x++)
    {
        for (var y = 0; y < rows; y++)
        {
            grid[x][y].revealed = true;
        }
    }
}

Cell.prototype.show = function()
{
    stroke(0);
    fill(116, 190, 113);
    rect(this.x, this.y, this.w, this.w);
    if (this.revealed)
    {
      if (this.bee)
      {
          fill(238, 164, 53);
          ellipse(this.x + this.w * 0.5, this.y + this.w * 0.5, this.w * 0.5)
          

      }
      else
      {
          fill(154, 226, 170);
          rect(this.x, this.y, this.w, this.w);
          
          if (this.neighbor > 0)
          {
              textAlign(CENTER);
              textSize(20);
              fill(0);
              text(this.neighbor, this.x + this.w * 0.5, this.y + this.w - 17);
          }
      }
    }
}

Cell.prototype.neighbors = function()
{
    if (this.bee)
    {
        this.neighbor = -1;
        return;
    }

    var total = 0;

    for (var xoff = -1; xoff <= 1; xoff++)
    {
        for (var yoff = -1; yoff <= 1; yoff++)
        {
            var x = this.a + xoff;
            var y = this.b + yoff;

            if (x > -1 && x < cols && y > -1 && y < rows)
            {
                var neighbors = grid[x][y];

                if (neighbors.bee)
                {
                    total++;
                }
            }
        }
    }
    this.neighbor = total;
}

Cell.prototype.contains = function(x, y)
{
    return (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.w)
}

Cell.prototype.reveal = function()
{
    this.revealed = true;

    if (this.neighbor == 0)
    {
        this.floodfill();
    }
}

Cell.prototype.floodfill = function()
{
    for (var xoff = -1; xoff <= 1; xoff++)
    {
        for (var yoff = -1; yoff <= 1; yoff++)
        {
            var x = this.a + xoff;
            var y = this.b + yoff;
    
            if (x > -1 && x < cols && y > -1 && y < rows)
            {
                var neighbor = grid[x][y];

                if (!neighbor.bee && !neighbor.revealed)
                {
                    neighbor.reveal();
                }
            }
        }
    }    
}

var grid;
var cols;
var rows;
var w = 50;
var bees = 20;

function setup()
{
    createCanvas(501, 501);
    cols = floor(width / w);
    rows = floor(height  /w);
    grid = makeArray(cols, rows)

    for (var x = 0; x < cols; x++)
    {
        for (var y = 0; y < rows; y++)
        {
            grid[x][y] = new Cell(x, y, w);
        }
    }

    var options = []

    for (var x = 0; x < cols; x++)
    {
        for (var y = 0; y < rows; y++)
        {
            options.push([x, y]);
        }
    }

    for (var x = 0; x < bees; x++)
    {
        var index = floor(random(options.length));
        var choice = options[index];
        var beeX = choice[0];
        var beeY = choice[1];
        options.splice(index, 1);

        grid[beeX][beeY].bee = true;
    }

    for (var x = 0; x < cols; x++)
    {
        for (var y = 0; y < rows; y++)
        {
            grid[x][y].neighbors();
        }
    }
}

function mousePressed()
{
    for (var x = 0; x < cols; x++)
    {
        for (var y = 0; y < rows; y++)
        {
            if (grid[x][y].contains(mouseX, mouseY))
            {
                grid[x][y].reveal();

                if (grid[x][y].bee)
                {
                    gameOver();
                }
            }
        }
    }
}

function draw()
{
    for (var x = 0; x < cols; x++)
    {
        for (var y = 0; y < rows; y++)
        {
            grid[x][y].show();
        }
    }
}