describe('gol service', function() {
    var grid;
    var width = 3;
    var height = 3;
    
    var cell_1_1 = {'row':1, 'col':1};
    var cell_2_1 = {'row':2, 'col':1};
    var cell_2_3 = {'row':2, 'col':3};
    
    // TODO initGrid()

    beforeEach(function() {
        grid = [[0, 0, 1],
                [0, 1, 1],
                [0, 1, 1]];
    });
    
    var isAlive = function(cell) {
        console.log('cell val:' + cell);
        if ('undefined' === typeof cell) {
            throw new Error('Undefined cell');
        }
        return cell;
    };
    
    describe('isAlive', function() {
        xit('should be falsy if cell does not exist.', function() {
            var cell = {'row':-1, 'col':1};
           // expect(function() { isAlive(cell); } ).toThrow();
           expect(isAlive(cell)).toBeFalsy();
        });
        
        it('should be truthy if cell val is 0.', function() {
            expect(isAlive(cell_1_1).toBeFalsy();
        });
        
        it('should be truthy if cell val is 1.', function() {
            expect(isAlive(cell_2_3)).toBeTruthy();
        });
    });
    
    
    
    var livingNeighbors = function(cell) {
        // TODO get coords??
        var row = cell.row;
        var col = cell.col
        
        var neighbors = getNeighbors(cell);
        
        for (var i = 0; i < neighbors.length; i++) {
            if (neighbors[i]) { living++; }
        }
        return 0;
    };
    
    var disposition = function(cell) {
        var neighbors = livingNeighbors(cell);
        
        return (3 === neighbors) ? 1 : 0;
    };
    
    describe('livingNeighbors', function() {
        it('should return 1 living neighbor for [1,1]', function() {
            expect(livingNeighbors(cell_1_1).toEqual(1);
        });
        it('should return 2 living neighbors for [2,1]', function() {
            expect(livingNeighbors(cell_2_1).toEqual(2);
        });
        it('should return 3 living neighbors for [,3]', function() {
            expect(livingNeighbors(cell_2_3).toEqual(4);
        });
        it('should return 4 living neighbors for [2,3]', function() {
            expect(livingNeighbors(cell_2_3).toEqual(4);
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

