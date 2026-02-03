//----------------------------------별--------------------------//
$(function () {
  var COUNT = 180;

  $('.stars').each(function () {
    var $stars = $(this);
    $stars.empty();

    for (var i = 0; i < COUNT; i++) {

      var s = (Math.random() * 2 + 1).toFixed(2) + 'px';
      var o = (Math.random() * 0.6 + 0.2).toFixed(2);
      var tw = (Math.random() * 4 + 2.5).toFixed(2) + 's';
      var mv = (Math.random() * 25 + 18).toFixed(2) + 's';

      var delay = (-Math.random() * parseFloat(mv)).toFixed(2) + 's';

      var x = (Math.random() * 100).toFixed(2) + 'vw';


      var y = ((Math.random() * 140) - 20).toFixed(2) + 'vh';


      var dx = ((Math.random() * 40) - 20).toFixed(2) + 'px';

      var $star = $('<i class="star"></i>').css({
        left: x,
        top: y,
        '--s': s,
        '--o': o,
        '--tw': tw,
        '--mv': mv,
        '--delay': delay,
        '--dx': dx
      });

      $stars.append($star);
    }
  });
});

//-----------------------------이미지, 해시태그------------------------------//




$(function () {

  function clamp(n, min, max){
    return Math.max(min, Math.min(max, n));
  }

  function easeInOut(t){
    // 0~1 부드러운 곡선 (등장/사라짐 동일한 느낌)
    return t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t + 2, 2)/2;
  }

  function update(){

    var $wrap  = $(".character_scroll");
    var $list  = $(".selfies");
    var $popup = $(".popup_img");

    if(!$wrap.length || !$list.length || !$popup.length) return;

    var wrapTop = $wrap.offset().top;
    var wrapH   = $wrap.outerHeight();
    var st      = $(window).scrollTop();
    var vh      = $(window).height();

    // 섹션 밖이면 무조건 숨김
    if(st < wrapTop || st > wrapTop + wrapH){
      $popup.css({ opacity: 0, transform: "translate(-50%, -50%) scale(0.95)" });
      return;
    }

    var scrollable = wrapH - vh;
    if(scrollable <= 0) return;

    var scrolled = clamp(st - wrapTop, 0, scrollable);
    var progress = scrolled / scrollable; // 0~1

    /* 1) 가로 이동 */
    var horizontalEnd = 0.75;
    var hProgress = clamp(progress / horizontalEnd, 0, 1);

    var maxMove = $list[0].scrollWidth - $(window).width();
    if(maxMove < 0) maxMove = 0;

    $list.css("transform", "translateX(" + (-maxMove * hProgress) + "px)");

    /* 2) 팝업 타임라인: 등장 -> 머무름 -> 사라짐 */
    var inStart = horizontalEnd; // 시작
    var inEnd   = 0.88;          // 등장 끝
    var holdEnd = 1.1;          // 머무름 끝
    var outEnd  = 1.00;          // 사라짐 끝

    var opacity = 0;
    var scale   = 0.95;

    if(progress < inStart){
      opacity = 0;
      scale = 0.95;
    }
    else if(progress < inEnd){
      // 등장 (0→1)
      var t = (progress - inStart) / (inEnd - inStart);
      t = clamp(t, 0, 1);
      var e = easeInOut(t);

      opacity = e;
      scale   = 0.95 + 0.05 * e;   // 0.95 → 1.00
    }
    else if(progress < holdEnd){
      // 머무름
      opacity = 1;
      scale   = 1;
    }
    else{
      // 사라짐 (1→0) : 등장과 대칭
      var t2 = (progress - holdEnd) / (outEnd - holdEnd);
      t2 = clamp(t2, 0, 1);
      var e2 = easeInOut(t2);

      opacity = 1 - e2;
      scale   = 1 - 0.05 * e2;     // 1.00 → 0.95
    }

    $popup.css({
      opacity: opacity,
      transform: "translate(-50%, -50%) scale(" + scale + ")"
    });
  }

  $(window).on("scroll resize", update);
  update();
});





//----------------------------자기소개와 게이지-----------------------------//

$(function () {
  var $me = $('.me');
  var $track = $('.intro_ability');
  var $intro = $track.find('> li.intro');
  var $introItems = $intro.find('> ul > li');
  var $ability = $track.find('> li.ability');

  if (!$me.length || !$track.length) return;

  var speed = 0.5;

  //  타임라인 분할(0~1)
var T_INTRO_END = 0.65;
var T_SLIDE_END = 0.80;

  var T_GAGE_END = 1.00;  // 게이지 끝(그냥 1)

  // 게이지 최대 길이(px)
  var gages = [
    { $el: $ability.find('.gage1'), max: 450 },
    { $el: $ability.find('.gage2'), max: 450 },
    { $el: $ability.find('.gage3'), max: 350 },
    { $el: $ability.find('.gage4'), max: 500 },
    { $el: $ability.find('.gage5'), max: 500 }
  ];

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function setSectionHeight() {
    var vh = $(window).height();
    var maxTranslate = $track[0].scrollWidth - $(window).width();
    var needScroll = (maxTranslate / speed);
    $me.height(vh + needScroll);
  }

  function getProgress() {
    var r = $me[0].getBoundingClientRect();
    var vh = window.innerHeight;

    var scrollable = $me.outerHeight() - vh;
    if (scrollable <= 0) return 0;

    var scrolled = clamp(-r.top, 0, scrollable);
    return scrolled / scrollable; // 0~1
  }

  function render() {
    var p = getProgress(); // 0~1

    // -------------------------------
 // 1) INTRO 순차 공개 (0 ~ T_INTRO_END)
var ip = clamp(p / T_INTRO_END, 0, 1); // 0~1
if ($introItems.length) {
  var count = $introItems.length;

  for (var i = 0; i < count; i++) {
    var raw = clamp(ip * count - i, 0, 1);

    // easeInOut
    var t = raw < 0.5
      ? 2 * raw * raw
      : 1 - Math.pow(-2 * raw + 2, 2) / 2;

    $introItems.eq(i).css('--t', t);
  }
}

    // -------------------------------
    // 2) 가로 이동: intro가 끝난 뒤에만 시작
    //    p <= T_INTRO_END 이면 xProgress = 0 (intro 고정)
    //    T_INTRO_END ~ T_SLIDE_END 에서 0->1로 이동
    // -------------------------------
    var xProg = (p - T_INTRO_END) / (T_SLIDE_END - T_INTRO_END);
    xProg = clamp(xProg, 0, 1);

    var maxX = $track[0].scrollWidth - window.innerWidth;
    $track.css('transform', 'translateX(' + (-maxX * xProg) + 'px)');

    // -------------------------------
    // 3) ABILITY 게이지: ability 도착 후에만 진행
    //    T_SLIDE_END ~ 1 에서 0->1
    // -------------------------------
    var gp = (p - T_SLIDE_END) / (T_GAGE_END - T_SLIDE_END);
    gp = clamp(gp, 0, 1);

    for (var j = 0; j < gages.length; j++) {
      var g = gages[j];
      if (g.$el.length) g.$el.css('width', (g.max * gp) + 'px');
    }
  }

  setSectionHeight();
  render();

  $(window).on('scroll', render);
  $(window).on('resize', function () {
    setSectionHeight();
    render();
  });
});




/*--------------------------------작업물--------------------------*/
$(function () {
  var $s = $('.work'),
    $u = $('.workpiece ul');

  $(window).on('scroll resize', function () {
    var r = $s[0].getBoundingClientRect(),
      vh = innerHeight,
      maxScroll = $s.outerHeight() - vh,
      scroll = Math.min(Math.max(-r.top, 0), maxScroll),
      p = scroll / maxScroll,
      maxX = $u[0].scrollWidth - innerWidth;

    $u.css('transform', 'translateX(' + (-maxX * p) + 'px)');
  }).trigger('scroll');
});


