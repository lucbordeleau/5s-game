
/**************** Init ************************/

var numbers = [ ];
var bodyWidth = document.body.clientWidth;
var bodyHeight = document.body.clientHeight;
var boardWidth = $("#board").width();
var boardHeight = $("#board").height();
var currentClickableNumber = 1;


var min_x = 0;
var max_x = boardWidth - 20;
var min_y = 0;
var max_y = boardHeight - 120;
var filled_areas = new Array();

var CounterOriginalTimer = 5;
var CounterCurrentTimer = 0;
var CounterOn = false;
var Counter ;

var score1 = 0;
var score2 = 0;
var score3 = 0;
var score4 = 0;


var StepStatus = 1;

/************* Declare the doughnut score graph  ***************/

var objScore1 = $('#score1-donut').peity('donut', {
    fill: ["#fd0", "#5a5a5a"],
    radius: 30,
    innerRadius: 10
});

var objScore2 = $('#score2-donut').peity('donut', {
    fill: ["#fd0", "#5a5a5a"],
    radius: 30,
    innerRadius: 10
});

var objScore3 = $('#score3-donut').peity('donut', {
    fill: ["#fd0", "#5a5a5a"],
    radius: 30,
    innerRadius: 10
});

var objScore4 = $('#score4-donut').peity('donut', {
    fill: ["#fd0", "#5a5a5a"],
    radius: 30,
    innerRadius: 10
});


/************* Document Ready ***************/
$(document).ready( function() {

    createDialog("#dialog1");

    setTimeout( function() {
        $("#board").css("background-image", "url('/images/board-bg.jpg')");
    },1000);

});


function progress(percent, $element) {
    var progressBarWidth = percent * $element.width() / 100;
    $element.find('div').animate({ width: progressBarWidth }, 300).html(percent + "  ");

}


function startTimer() {
    
    $('#progressBar').css("visibility", "visible");
    clearInterval(Counter);
    progress(100, $('#progressBar'));
    CounterCurrentTimer = CounterOriginalTimer;
    CounterOn = true;
    Counter = setInterval(function() {
        CounterCurrentTimer -= 1;
        if (CounterCurrentTimer < 0 ) { 
            clearInterval(Counter);
            CounterOn = false;
            CounterFinished();
        };
        var temppercent = Math.round((CounterCurrentTimer/CounterOriginalTimer)*100);
        progress(temppercent, $('#progressBar'));
    }, 1000);

};


function CounterFinished() {
    clearInterval(Counter);
    $('#progressBar').css("visibility", "hidden");
    currentClickableNumber = parseInt(currentClickableNumber)-1;


    switch(StepStatus) {
        case 1:
            score1 = currentClickableNumber;
            $("#score1").html(currentClickableNumber );
            objScore1.text(score1 + "/50").change();
            $("#score1-label").html(score1);

            createDialog("#dialog2");

            setTimeout( function() {
                var vid = document.getElementById('video2');
                console.log(vid);
                vid.play();
            },1500);
            StepStatus = 2; 
            break;

        case 2:
            score2 = currentClickableNumber;
            $("#score2").html(currentClickableNumber );
            objScore2.text(score2 + "/50").change();
            $("#score2-label").html(score2);
            createDialog("#dialog3");
            StepStatus = 3;
            break;

        case 3:
            score3 = currentClickableNumber;
            $("#score3").html(currentClickableNumber );
            objScore3.text(score3 + "/50").change();
            $("#score3-label").html(score3);
            createDialog("#dialog4");
            StepStatus = 4; 
            break;

        case 4:
            score4 = currentClickableNumber;
            $("#score4").html(currentClickableNumber );
            objScore4.text(score4 + "/50").change();
            $("#score4-label").html(score4);
            createDialog("#dialog5");
            StepStatus = 1;
            break;
        }
    
};

function createDialog(elem){
    $("#dialog-wrapper").html('');
    var diag1 = $(elem).html();
    $(diag1).appendTo("#dialog-wrapper");

    $("#dialog-wrapper").show();
};


function StartRound1() {

    $("#dialog-wrapper").fadeOut(200);
    GenerateNewCards();
    setTimeout( function() {
        GenerateWorkSpace();
    },500);
};


function StartRound2() {

    $(".board-numbers").removeClass("clicked");
    $("#dialog-wrapper").fadeOut(200);
    
    setTimeout( function() {
        RemoveUnnecessary();
    },500);
};


function StartRound3() {

    $(".board-numbers").removeClass("clicked");
    $("#dialog-wrapper").fadeOut(200);

    setTimeout( function() {
        shine();
    },200);

    setTimeout( function() {
        PutCardsInQuadrant();
    }, 1500);
};



function StartRound4() {

    $(".board-numbers").removeClass("clicked");
    $("#dialog-wrapper").fadeOut(200);
    
    setTimeout( function() {
        SortCards();
    },500);
};




function GenerateNewCards() {
    
    numbers = [];
    var quadrant = 1;
    for (var i=1, t=99; i<t; i++) {

        var rndSize = Math.round(Math.random() * 20) + 18;
        var min = -50;
        var max = 60;
        var rndRotation = Math.floor(Math.random() * (max - min + 1)) + min;

        var rndX = Math.round(Math.random() * (boardWidth-120));
        var rndY = Math.round(Math.random() * (boardHeight-120));

        var color = Math.round(Math.random() * 4);
        var arrcolor = ["#000", "#000", "#444", "#888", "#DDD"];
        var definecolor = arrcolor[color];


        numbers.push({
            number : i,
            size: rndSize + "px",
            rotation: rndRotation,
            offsetX: rndX,
            offsetY: rndY,
            color: definecolor,
            quadrant: quadrant
        });

        quadrant += 1;
        if (quadrant > 9) {
            quadrant = 1;
        }
    }
};



function GenerateWorkSpace() {


    filled_areas = new Array();
    var boardWidth = $("#board").width();
    var boardHeight = $("#board").height();
    
    max_x = boardWidth - 120;
    max_y = boardHeight - 120;

    $(".quadrant").hide();
    $(".board-numbers").remove();
    
    currentClickableNumber = 1;
    var item_template = $("#template-numbers").html();

    $(numbers).each( function(n, e) {
        
        var NewItem = $(item_template).appendTo("#board");
        $(NewItem).html(e.number);
        $(NewItem).attr("data-number", e.number);
        $(NewItem).attr("data-quadrant", e.quadrant);

        $(NewItem).css("font-size", e.size);
        $(NewItem).css("color", e.color);

        var degrees = e.rotation;


        $(NewItem).css({'-webkit-transform' : 'rotate('+ degrees +'deg)',
                        '-moz-transform' : 'rotate('+ degrees +'deg)',
                        '-ms-transform' : 'rotate('+ degrees +'deg)',
                        'transform' : 'rotate('+ degrees +'deg)'
            });


        $(NewItem).css('left', '50%');
        $(NewItem).css('top', '50%');


        var rand_x=0;
        var rand_y=0;

        var cardWidth = $(NewItem).width();
        var cardHeight = $(NewItem).height();
        var max_x = boardWidth - cardWidth;
        var max_y = boardHeight - cardHeight;
        var area;
        do {
            rand_x = Math.round(min_x + ((max_x - min_x)*(Math.random() % 1)));
            rand_y = Math.round(min_y + ((max_y - min_y)*(Math.random() % 1)));
            area = {x: rand_x, y: rand_y, width: $(NewItem).width(), height: $(NewItem).height()};
        } while(check_overlap(area));
        
        filled_areas.push(area);
        
        $(NewItem).css({left:rand_x, top: rand_y});


    });

    $( ".board-numbers" ).click(function() {

        if (CounterOn) {
                var numberclicked = $( this ).html();
                var that = this
                //console.log("clicked " + numberclicked);
                if (parseInt(numberclicked) === parseInt(currentClickableNumber)) {
                    $( that ).addClass("clicked");
                    currentClickableNumber += 1;
                    if (currentClickableNumber == 51) {
                        CounterFinished();
                    };
                } 
        }

    });

    startTimer();

};


function RemoveUnnecessary() {
    
    currentClickableNumber = 1;
    $(".board-numbers").each( function(n, e) {
        var cardnumber = $(e).html();
        if (cardnumber > 50 ) {
            $(e).hide(700, function(){ $(e).remove(); });
        }
    });

    setTimeout( function() {
        startTimer();
    }, 1000);

    
    
};




function shine() {
    $(".board-numbers").addClass("shined");
    $(".board-numbers").each( function(n, e) {

        $(e).css("color","#000");

        var degrees = 0;

        $(e).css({'-webkit-transform' : 'rotate('+ degrees +'deg)',
                        '-moz-transform' : 'rotate('+ degrees +'deg)',
                        '-ms-transform' : 'rotate('+ degrees +'deg)',
                        'transform' : 'rotate('+ degrees +'deg)'
                    });

    });
    setTimeout ( function() { 
        $(".board-numbers").removeClass("shined");

    }, 1000);

};

function PutCardsInQuadrant() {


    /* Put Cards In correct Quadrant ************/
    $(".quadrant").css("z-index", 10);
    $(".quadrant").show();

    $(".board-numbers").removeClass("clicked");
    currentClickableNumber = 1;

    $(".board-numbers").each( function(n, e) {
        var cardquadrant = $(e).attr("data-quadrant");

        $(e).appendTo($('#quadrant' + cardquadrant));
        $(e).css('left', '50%');
        $(e).css('top', '50%');

    });

    $(".quadrant").each( function(n, e) {
        filled_areas = new Array();
        var quadrantWidth = $(this).width();
        var quadrantHeight = $(this).height();


        $(this).find('.board-numbers').each(function(textIndex) {

            var rand_x=0;
            var rand_y=0;
            var cardWidth = $(this).width();
            var cardHeight = $(this).height();
            var max_x = quadrantWidth - cardWidth;
            var max_y = quadrantHeight - cardHeight;
            var area;
            do {
                rand_x = Math.round(min_x + ((max_x - min_x)*(Math.random() % 1)));
                rand_y = Math.round(min_y + ((max_y - min_y)*(Math.random() % 1)));
                area = {x: rand_x, y: rand_y, width: $(this).width(), height: $(this).height()};
            } while(check_overlap(area));
            
            filled_areas.push(area);
            
            $(this).css({left:rand_x, top: rand_y});

        });
    });

    startTimer();
}




function SortCards() {
    $(".board-numbers").hide();
    $(".board-numbers").removeClass("clicked");
    
    currentClickableNumber = 1;

    $(numbers).each( function(n, e) {
        var TempCard = $(document).find('.board-numbers[data-number=' + e.number + ']');

        $(TempCard).appendTo($('#board'));
        $(TempCard).css('display', 'inline-block');
        $(TempCard).css({left:0, top: 0});
        $(TempCard).css('margin', '10px');
        $(TempCard).css('position', 'relative');
        $(TempCard).fadeIn();

    });
    $(".quadrant").fadeOut(200);

    startTimer();
};


function check_overlap(area) {
    for (var i = 0; i < filled_areas.length; i++) {
        
        check_area = filled_areas[i];
        
        var bottom1 = area.y + area.height;
        var bottom2 = check_area.y + check_area.height;
        var top1 = area.y;
        var top2 = check_area.y;
        var left1 = area.x;
        var left2 = check_area.x;
        var right1 = area.x + area.width;
        var right2 = check_area.x + check_area.width;
        if (bottom1 < top2 || top1 > bottom2 || right1 < left2 || left1 > right2) {
            continue;
        }
        return true;
    }
    return false;
}












