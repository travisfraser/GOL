describe('gol service', function() {
    var grid;
    var cols = 3;
    var rows = 3;
    
    var cell_1_1 = {'row':1, 'col':1};
    var cell_2_1 = {'row':2, 'col':1};
    var cell_2_3 = {'row':2, 'col':3};
    var cell_3_3 = {'row':3, 'col':3};
    
    var emptyGrid;

    beforeEach(function() {
      grid = [[0, 0, 1],
              [0, 1, 1],
              [0, 1, 1]];
      emptyGrid = [[0,0,0],
                  [0,0,0],
                  [0,0,0]];
    });

    var initGrid = function(rows, cols, defaultValue) {
        var arr = [];
        for (var i = 0; i < rows; i++) {
           arr.push([]);
           arr[i].push(new Array(cols));
           for (var j = 0; j < cols; j++) {
               arr[i][j] = defaultValue;
           }
        }
        return arr;
    };
    
    var seedGrid = function(grid, phrase) {
      var phraseIndex = 0;
      var vowels = 'aeiouy';
      var filledGrid = grid.slice(0);

      for (var r = 0; r < grid.length; r++) {
        for (var c = 0; c < grid.length; c++) {
          var currLetter = phrase.charAt(phraseIndex);
          if (vowels.indexOf(currLetter) > -1){
            filledGrid[r][c] = 1;
          }
          if (phraseIndex < phrase.length - 1) {
            phraseIndex++;
          }
          else {
            phraseIndex = 0;
          }
        }
      }
      console.log(grid + ' ' + filledGrid);
      return filledGrid;
    };
    
    describe('seedGrid', function() {
        var filledGrid = [[0, 1, 0],
                          [0, 1, 0],
                          [0, 1, 0]];
        var phrase = 'ferretfun';
        it('should animate vowel positions', function() {
            expect(seedGrid(emptyGrid, phrase)).toEqual(filledGrid);
        });
    });

    
    describe('initGrid', function() {
        it('should create an empty matrix', function() {
            expect(initGrid(3, 3, 0)).toEqual(emptyGrid);

        });
    });
    
    var isAlive = function(cell) {
        var row = cell.row;
        var col = cell.col;

        if (row < 1 || row > rows) { return 0; }
        if (col < 1 || col > cols) { return 0; }
        return grid[row - 1][col - 1];
    };
    
    describe('isAlive', function() {
        it('should be falsy if cell does not exist.', function() {
            var cell = {'row':-1, 'col':1};
            expect(isAlive(cell)).toBeFalsy();
        });
        it('should be falsy if cell val is 0.', function() {
            expect(isAlive(cell_1_1)).toBeFalsy();
        });
        it('should be truthy if cell val is 1.', function() {
            expect(isAlive(cell_2_3)).toBeTruthy();
        });
    });
    
    var getNeighbors = function(cell) {
        var row = cell.row;
        var col = cell.col;
        var neighbors = [
            {'row':row - 1, 'col':col},
            {'row':row - 1, 'col':col + 1},
            {'row':row, 'col':col + 1},
            {'row':row + 1, 'col':col + 1},
            {'row':row + 1, 'col':col},
            {'row':row + 1, 'col':col - 1},
            {'row':row, 'col':col - 1},
            {'row':row - 1, 'col':col -1}
        ];
        
        return neighbors;
    };    
    
    var livingNeighbors = function(cell) {
        var neighbors = getNeighbors(cell);

        var living = 0;
        for (var i = 0; i < neighbors.length; i++) {
            if (isAlive(neighbors[i])) { living++; }
        }
        return living;
    };
    
    var disposition = function(cell) {
        var neighbors = livingNeighbors(cell);
        if ((2 === neighbors) && isAlive(cell)) { neighbors++; } 
        return (3 === neighbors) ? 1 : 0;
    };
    
    describe('livingNeighbors', function() {
        it('should return 1 living neighbor for [1,1]', function() {
            expect(livingNeighbors(cell_1_1)).toEqual(1);
        });
        it('should return 2 living neighbors for [2,1]', function() {
            expect(livingNeighbors(cell_2_1)).toEqual(2);
        });
        it('should return 3 living neighbors for [3,3]', function() {
            expect(livingNeighbors(cell_3_3)).toEqual(3);
        });
        it('should return 4 living neighbors for [2,3]', function() {
            expect(livingNeighbors(cell_2_3)).toEqual(4);
        });
    });

    describe('disposition', function() {
        it('should be falsy for <2 living neighbors', function() { 
            var result = disposition(cell_1_1);
            expect(result).toBeFalsy();
        });
        it('should be falsy for >3 living neighbors', function() { 
            var result = disposition(cell_2_3);
            expect(result).toBeFalsy();
        });
        it('should be truthy for =3 living neighbors', function() { 
            var cell = {'row':3, 'col':3};
            var result = disposition(cell);
            expect(result).toBeTruthy();
        });
        it('of live cell should be truthy for =2 living neighbors', function() { 
            var cell = {'row':1, 'col':3};
            var result = disposition(cell);
            expect(result).toBeTruthy();
        });
        it('of dead cell should be falsy for =2 living neighbors', function() { 
            var result = disposition(cell_2_1);
            expect(result).toBeFalsy();
        });
    });
// Living cell
//    <2 living : die
//    >3 living : die
//    =2 or =3 living : live

// Dead cell
//    <2 living : die
//    >3 living : die
//    =3 living : live
});

