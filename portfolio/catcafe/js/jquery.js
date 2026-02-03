$(document).on('click', 'a[href="#"]', function(e){
  e.preventDefault();
});
/*====================================메인 고양이 클릭이벤트==========================*/
$(function(){

  $('.sum article').on('click', function(e){
    e.stopPropagation();

    $('.sum article > div').hide();   
    $(this).children('div').show();   
  });

  $(document).on('click', function(){
    $('.sum article > div').hide();
  });

});

$(function(){

  $('.fall article').on('click', function(e){
    e.stopPropagation();

    $('.fall article > div').hide();   
    $(this).children('div').show();   
  });

  $(document).on('click', function(){
    $('.fall article > div').hide();
  });

});

/*========================================메인 버튼이벤트=================================*/
$(function(){

  var $track = $('main > ul:first-of-type');   // 여름/가을 트랙
  var $prev  = $('.mainbutton li:eq(0) a');    // ← 버튼
  var $next  = $('.mainbutton li:eq(1) a');    // → 버튼

  var idx = 0; // 0 = 여름(sum), 1 = 가을(fall)
  var lock = false; // 연타 방지

  // 처음엔 왼쪽 버튼 숨김
  $prev.hide();

  function update(){
    $track.css('transform', 'translateX(' + (-50 * idx) + '%)');

    if(idx === 0){
      $prev.hide();
      $next.show();
    }else{
      $prev.show();
      $next.hide();
    }
  }

  function go(to){
    if(lock || idx === to) return;
    lock = true;
    idx = to;
    update();
    setTimeout(function(){ lock = false; }, 700);
  }

  // → 클릭 : 여름 → 가을
  $next.on('click', function(e){
    e.preventDefault();
    go(1);
  });

  // ← 클릭 : 가을 → 여름
  $prev.on('click', function(e){
    e.preventDefault();
    go(0);
  });

});
/*=================================메뉴리스트 좌우 이동클릭 이벤트=====================*/
$(function () {

  // 한 번에 여러번 클릭 방지용
  var DURATION = 400; // CSS transition 시간(ms)과 맞추기

  $('.menu_list').each(function () {

    var $listItem = $(this);
    var $wrap = $listItem.find('.menu_wrap');
    var $prev = $wrap.find('.arrow.prev');
    var $next = $wrap.find('.arrow.next');
    var $ul   = $wrap.find('.menu_view > ul');

    var animating = false;

    // li 한 칸(px) 계산: (첫 li 너비 + gap)
    function stepPx() {
      var $li = $ul.children('li').first();
      if (!$li.length) return 0;

      var liW = $li.outerWidth(true); // margin 포함(거의 0일테지만)
      // gap은 flex-gap이라 outerWidth로 안 잡힐 수 있어서 보정:
      // 두번째 li가 있으면 left 차이로 gap 포함한 "한칸"을 정확히 구함
      var $li2 = $li.next();
      if ($li2.length) {
        var x1 = $li.position().left;
        var x2 = $li2.position().left;
        return Math.round(x2 - x1);
      }
      return liW;
    }

    // 초기 transform 0
    $ul.css('transform', 'translateX(0px)');

    // 오른쪽 버튼: 1번이 사라지고 1번이 뒤로(= 다음칸으로)
    $next.on('click', function (e) {
      e.preventDefault();
      if (animating) return;
      animating = true;

      var step = stepPx();
      if (!step) { animating = false; return; }

      // 왼쪽으로 한칸 이동 애니메이션 (다음 메뉴들이 앞으로)
      $ul.css('transition', 'transform ' + DURATION + 'ms ease');
      $ul.css('transform', 'translateX(' + (-step) + 'px)');

      setTimeout(function () {
        // 애니메이션 끝나면 첫번째를 맨 뒤로 보내고, 위치 리셋
        $ul.css('transition', 'none');
        $ul.append($ul.children('li').first());
        $ul.css('transform', 'translateX(0px)');

        // reflow (transition 적용 안정화)
        $ul[0].offsetHeight;

        animating = false;
      }, DURATION);
    });

    // 왼쪽 버튼: 6번째가 왼쪽 1번으로 나오게(= 이전칸)
    $prev.on('click', function (e) {
      e.preventDefault();
      if (animating) return;
      animating = true;

      var step = stepPx();
      if (!step) { animating = false; return; }

      // 먼저 마지막 li를 앞에 붙여두고, 왼쪽으로 밀린 상태로 시작
      $ul.css('transition', 'none');
      $ul.prepend($ul.children('li').last());
      $ul.css('transform', 'translateX(' + (-step) + 'px)');

      // reflow 후 0으로 애니메이션 (오른쪽으로 한칸 들어오는 느낌)
      $ul[0].offsetHeight;

      $ul.css('transition', 'transform ' + DURATION + 'ms ease');
      $ul.css('transform', 'translateX(0px)');

      setTimeout(function () {
        $ul.css('transition', 'none');
        animating = false;
      }, DURATION);
    });

    // 창 크기 바뀌면 위치 튀는 것 방지(필요시)
    $(window).on('resize', function () {
      $ul.css('transition', 'none');
      $ul.css('transform', 'translateX(0px)');
    });

  });

});
/*==================================md상품=================================*/
$(function () {


  $('.candlesmall .candlef').on('click', function (e) {
    e.preventDefault();

    const $clickedF = $(this);


    const cls = ($clickedF.attr('class').match(/candlef(\d+)/) || [])[1];
    if (!cls) return;


    $('.candlebig > li').removeClass('on');
    $('.candlebig .candle' + cls).addClass('on');

    $('.candlesmall .candlef.on').removeClass('on');
    $clickedF.addClass('on');
  });

});


