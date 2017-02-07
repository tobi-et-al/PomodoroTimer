// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

$(function() {
  
  var octupus = {
    init: function(){
      this.set = {'session':{'m': 25},'break':{'m': 5}};
      this.mode = 'session';
      this.set[this.mode].s = parseInt(this.set[this.mode].m * 60);
      view.init();
    },
    toSeconds:  function(ticker){
      return parseInt(ticker) * 60;
    },
    updateticker: function(seconds){   
          octupus.set[octupus.mode].s = seconds;
          
          if(octupus.set[octupus.mode].s <= 0 && octupus.mode == 'break'){
              octupus.stopjob();
              octupus.mode = 'session';
              octupus.set[octupus.mode].s = parseInt(octupus.toSeconds(octupus.set[octupus.mode].m));
              octupus.startjob();
              view.status(octupus.mode); 
          }       
      
          if(octupus.set[octupus.mode].s <= 0 && octupus.mode == 'session'){
              octupus.stopjob();
              octupus.mode = 'break';
              octupus.set[octupus.mode].s = parseInt(octupus.toSeconds(octupus.set[octupus.mode].m));
              octupus.startjob();
              view.status(octupus.mode); 
          }      
      
        var remainder = Math.round((((octupus.set[octupus.mode].s / 60) - Math.floor(octupus.set[octupus.mode].s / 60)) * 60) );
        var roundValue = Math.floor(octupus.set[octupus.mode].s / 60);
        var currentValue = '' + roundValue + ':' + octupus.padNumber(remainder);
        view.updateTicker(currentValue);
    },
    resetTicker: function(seconds, mode){  
        this.set[mode].m = (seconds);
        this.set[mode].s = parseInt(this.set[mode].m * 60);
    },
    padNumber: function(d){
        return (d < 10) ? '0' + d.toString() : d.toString();
    },
    startjob: function(){
      octupus.set[octupus.mode].m = parseInt((octupus.set[octupus.mode].m));
      
      var seconds = parseInt(octupus.set[octupus.mode].s); 
      var updateticker = this.updateticker;
      
      var timer = setInterval(function(){
        seconds = seconds - 1;
        updateticker(seconds);
      },1000);
      
      this.timer =  timer;
    },
    stopjob: function(){
      var timer = this.timer;
      clearInterval(timer);
    }
  };

  var view = {
    init:  function(){
      this.updateTicker(octupus.set[octupus.mode].m);
      this.updatedail(octupus.set['session'].m);
      this.updateBreakTime(octupus.set['break'].m);
      this.status(octupus.mode);
      
      $(this.handle).on({click: function(e){

          if($(this).hasClass("pause")){
              octupus.startjob();
              $(this).removeClass("pause").addClass("play");
          }else if($(this).hasClass("play")){
              octupus.stopjob();
              $(this).removeClass("play").addClass("pause");
          }
        }
      });
      
      $(this.dail).on('click', function(e){
        if($('.screen.pause').length && this.id === 'session'){

          if($(e.target).html() === '-' && ((($(this).find('.num').html()) - 1) > 0)){
            var newValue = parseInt($(this).find('.num').html()) - 1;
            octupus.resetTicker(newValue, this.id); 
            if($('.control h2').html() == this.id){
              view.updateTicker(octupus.set[this.id].m);
            }
            view.updatedail(octupus.set[this.id].m);


          }
          if($(e.target).html() === '+'){
            var newValue = parseInt($(this).find('.num').html()) + 1;
            octupus.resetTicker(newValue, this.id); 
            if($('.control h2').html() == this.id){
              view.updateTicker(octupus.set[this.id].m);
            }
            view.updatedail(octupus.set[this.id].m);
          }
        }
        if($('.screen.pause').length && this.id === 'break'){

          if($(e.target).html() === '-' && ((($(this).find('.num').html()) - 1) > 0)){
            var newValue = parseInt($(this).find('.num').html()) - 1;
            octupus.resetTicker(newValue, this.id); 
            if($('.control h2').html() == 'break'){
              view.updateTicker(octupus.set[this.id].m);
            }
            view.updateBreakTime(octupus.set[this.id].m);
          }
          if($(e.target).html() === '+'){
            var newValue = parseInt($(this).find('.num').html()) + 1;
            octupus.resetTicker(newValue, this.id); 
            if($('.control h2').html() == this.id){
              view.updateTicker(octupus.set[this.id].m);
            }
            view.updateBreakTime(octupus.set[this.id].m);
          }
        }
      });
      
    },
    handle:'.control .screen',
    title:'.control h2',
    break:'.session .break',
    dail: '.session, .break',
    updateTicker:function(time){ 
      $(this.handle).html(time);
    },
    updateBreakTime:function(time){
      $('.break .num').html(time);
    },
    updatedail:function(time){
      $('.session .num').html(time);
    },
    status:function(status){
      $(this.title).html(status);
      $(this.title).attr('class', '')
      $(this.title).addClass('text-'+status);
    }
  };
  
  octupus.init()

});
