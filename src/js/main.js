$(document).ready(function ($) {
    // typed.js
    $(".typed a").typed({
        strings: ["这里是网红DIYgod", "Anotherhome"],
        typeSpeed: 30,
        backSpeed: 30,
        backDelay: 700
    });

    // 利用 data-scroll 属性，滚动到任意 dom 元素
    $.scrollto = function (scrolldom, scrolltime) {
        $(scrolldom).click(function () {
            var scrolltodom = $(this).attr("data-scroll");
            $(this).addClass("active").siblings().removeClass("active");
            $('html, body').animate({
                scrollTop: $(scrolltodom).offset().top
            }, scrolltime);
            return false;
        });
    };
    // 判断位置控制 返回顶部的显隐
    if ($(window).width() > 800) {
        var backTo = $("#back-to-top");
        var backHeight = $(window).height() - 980 + 'px';
        $(window).scroll(function () {
            if ($(window).scrollTop() > 700 && backTo.css('top') === '-900px') {
                backTo.css('top', backHeight);
            }
            else if ($(window).scrollTop() <= 700 && backTo.css('top') !== '-900px') {
                backTo.css('top', '-900px');
            }
        });
    }
    // 启用
    $.scrollto("#back-to-top", 800);

    // 新窗口打开链接
    $(".post a").attr("target", "_blank");

    // Ctrl + Enter 提交回复
    $('#comment-content').keydown(function (event) {
        if (event.ctrlKey && event.keyCode == 13) {
            $('#submit').click();
            return false;
        }
    });

    // 点击标签 收起/展开 内容
    $('.side .block .label').click(function () {
        $(this).siblings('.list').slideToggle("slow");
    });
    $('.main .block .comments').click(function () {
        $(this).siblings('.comment-list').slideToggle("slow");
    });
    $('.main .block .round-date').click(function () {
        $(this).siblings('.label').slideToggle("slow");
        $(this).siblings('.article-content').slideToggle("slow");
    });

    // title变化
    var OriginTitile = document.title;
    var titleTime;
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            $('[rel="shortcut icon"]').attr('href', "//www.anotherhome.net/wp-content/themes/Amativeness/fail.ico");
            document.title = '(●—●)喔哟，崩溃啦！';
            clearTimeout(titleTime);
        }
        else {
            $('[rel="shortcut icon"]').attr('href', "//www.anotherhome.net/wp-content/themes/Amativeness/favicon.ico");
            document.title = '(/≧▽≦/)咦！又好了！' + OriginTitile;
            titleTime = setTimeout(function () {
                document.title = OriginTitile;
            }, 2000);
        }
    });

    //  分页功能（异步加载）
    $("#pagination a").on("click", function () {
        $(this).addClass("loading").text("文章列表加载中...");
        $.ajax({
            type: "POST",
            url: $(this).attr("href") + "#thumbs",
            success: function (data) {
                result = $(data).find("#thumbs .post");
                nextHref = $(data).find("#pagination a").attr("href");
                // 渐显新内容
                $("#thumbs").append(result.fadeIn(300));
                $("#pagination a").removeClass("loading").text("点击加载更多");
                if (nextHref != undefined) {
                    $("#pagination a").attr("href", nextHref);
                } else {
                    // 若没有链接，即为最后一页，则移除导航
                    $("#pagination").remove();
                }
            }
        });
        return false;
    });

    // 顶部头像动画
    document.getElementsByClassName('avatar')[0].onmouseover = function () {
        this.classList.add('animated', 'tada');
    };
    document.getElementsByClassName('avatar')[0].onmouseout = function () {
        this.classList.remove('animated', 'tada');
    };


    // Do you like me?
    $.getJSON("https://www.anotherhome.net/api/vote/like.php?action=get", function (data) {
        $('.like-vote span').html(data.like);
    });
    $('.like-vote').click(function () {
        $.getJSON("https://www.anotherhome.net/api/vote/like.php?action=add", function (data) {
            if (data.success) {
                $('.like-vote span').html(data.like);
                $('.like-title').html('我也喜欢你 (*≧▽≦)');
            }
            else {
                $('.like-title').html('你的爱我已经感受到了~');
            }
        });
    });

    // 博客已运行XXX
    show_date_time();

    // 当页面向下滚动时，导航条消失，当页面向上滚动时，导航条出现
    var head = document.getElementsByClassName('navbar')[0];
    var headroom = new Headroom(head, {
        "tolerance": 5,
        "offset": 205,
        "classes": {
            "initial": "head-animated",
            "pinned": "slideDown",
            "unpinned": "slideUp"
        }
    });
    headroom.init();

    // 版权信息
    var arCon = document.getElementsByClassName('article-content');
    for (var i = 0; i < arCon.length; i++) {
        arCon[i].addEventListener('copy', function (e) {
            if (window.getSelection().toString() && window.getSelection().toString().length > 42) {
                setClipboardText(e);
                //alert('商业转载请联系作者获得授权，非商业转载请注明出处，谢谢合作。');
                notie('info', '商业转载请联系作者获得授权，非商业转载请注明出处，谢谢合作。', true)
            }
        });
    }

    function setClipboardText(event) {
        var clipboardData = event.clipboardData || window.clipboardData;
        if (clipboardData) {
            event.preventDefault();

            var htmlData = ''
                + '著作权归作者所有。<br>'
                + '商业转载请联系作者获得授权，非商业转载请注明出处。<br>'
                + '作者：DIYgod<br>'
                + '链接：' + window.location.href + '<br>'
                + '来源：Anotherhome<br><br>'
                + window.getSelection().toString();
            var textData = ''
                + '著作权归作者所有。\n'
                + '商业转载请联系作者获得授权，非商业转载请注明出处。\n'
                + '作者：DIYgod\n'
                + '链接：' + window.location.href + '\n'
                + '来源：Anotherhome\n\n'
                + window.getSelection().toString();

            clipboardData.setData('text/html', htmlData);
            clipboardData.setData('text/plain', textData);
        }
    }

    // ASpace
    //aSpace(document.getElementById('content'));
    //if (document.getElementById('comment-content')) {
    //    document.getElementById('comment-content').addEventListener('change', function () {
    //        this.value = aSpace(this.value);
    //    });
    //}

    // poi
    // var poi = new Audio('https://dn-diygod.qbox.me/poi.wav');
    // poi.play();

    // 关闭侧边栏
    document.getElementsByClassName('close-side')[0].addEventListener('click', function () {
        document.getElementsByClassName('side')[0].style.display = 'none';
        document.getElementsByClassName('main')[0].style.width = '100%';
    });

    // 小工具跟随
    var $sidebar = $("#text-4"),
        $last = $("#secondary"),
        $window = $(window),
        offset = $last.offset().top + $last.height();
    $window.scroll(function () {
        if ($window.scrollTop() > offset) {
            $sidebar.css({"position": "fixed", "top": "40px", "width": "22%", "animation": "fade-in 0.5s"});
        } else {
            $sidebar.css({"position": "relative", "top": "0", "width": "initial", "animation": "initial"});
        }
    });

    // 防重复评论
    if (document.getElementById('submit')) {
        document.getElementById('submit').addEventListener('click', function () {
            this.value = '正在提交,好累呀~';
        });
    }

    // 搜索
    //function search() {
    //    var searchInput = this.getElementsByClassName('search-input')[0];
    //    if (searchInput.value) {
    //        var url = 'https://www.google.com/search?q=site:anotherhome.net%20' + searchInput.value;
    //        window.open(url, "_blank");
    //        return false;
    //    } else {
    //        return false;
    //    }
    //}


    // APlayer
    if (document.getElementById('player7')) {
        var ap7 = new APlayer({    //2537
            element: document.getElementById('player7'),
            autoplay: false,
            showlrc: 1,
            music: {
                title: '光るなら',
                author: '《四月是你的谎言》OP',
                url: 'https://dn-diygod.qbox.me/光るなら.mp3',
                pic: 'https://dn-diygod.qbox.me/光るなら.png',
                lrc: "[00:17.460]雨(あめ)上(あ)がりの虹(にじ)も (雨后的彩虹)\n[00:20.470]凛(りん)と咲(さ)いた花(はな)も (凛然绽放的花朵)\n[00:23.610]色(いろ)づき溢(あふ)れ出(だ)す (色彩仿佛要溢出)\n[00:29.710]茜色(あかねいろ)の空(そら (望着那个)\n[00:32.900]仰(あお)ぐ君(きみ)に (仰望绯红色天空的你)\n[00:34.850]あの日(ひ) 恋(こい)に落(お)ちた (就在那天 我坠入了爱河)\n[00:41.070]瞬間(しゅんかん)のドラマチック (戏剧性的瞬间)\n[00:44.270]フィルムの中(なか)の一(ひと)コマも (电影里的每个镜头)\n[00:47.190]消(き)えないよ 心(こころ)に刻(きざ)むから (我都铭记于心)\n[00:55.820]君(きみ)だよ 君(きみ)なんだよ (是你哦 就是你哟)\n[00:58.800]教(おし)えてくれた (告诉了我)\n[01:01.790]暗闇(くらやみ)も光(ひか)るなら (若能在黑暗中绽放光芒)\n[01:04.690]星空(ほしぞら)になる (就会如星空般闪亮)\n[01:07.820]悲(かな)しみを笑颜(えがお)に (被悲伤掩盖的笑容)\n[01:10.760]もう隠(かく)さないで (已经无需隐藏)\n[01:13.860]煌(きら)めくどんな星(ほし)も (闪耀的星光)\n[01:16.680]君(きみ)を照(て)らすから (会为你照亮前方)\n[01:21.440]眠(ねむ)りも忘(わす)れて迎(むか)えた朝日(あさひ)が (忘记了睡觉便迎来朝阳)\n[01:27.960]やたらと突(つ)き刺(さ)さる (胡乱刺眼的阳光)\n[01:33.780]低気圧(ていきあつ)运(はこ)ぶ 头痛だって (烦躁的令人头痛)\n[01:39.100]忘(わす)れる 君(きみ)に会(あ)えば (但只要见到你 便能瞬间遗忘)\n[01:45.480]静寂(せいじゃく)はロマンティック (浪漫的寂静)\n[01:48.380]红茶(こうちゃ)に溶(と)けたシュガーのように (像溶进红茶的砂糖)\n[01:51.520]全身(ぜんしん)に巡(めぐ)るよ 君(きみ)の声(こえ (全身都沉浸在你的声音中)\n[02:00.160]君(きみ)だよ 君(きみ)なんだよ (是你哦 就是你哟)\n[02:03.310]笑颜(えがお)をくれた (带给了我笑容)\n[02:06.400]涙(なみだ)も光(ひか)るなら (眼泪若能绽放光芒)\n[02:09.210]流星(りゅうせい)になる (就会像流星一样)\n[02:12.440]傷付(きずつ)いたその手(て)を (这双伤痕累累的手)\n[02:15.210]もう離(はな)さないで (请不要再松开)\n[02:18.360]愿(ねが)いを込(こ)めた空(そら)に (寄托心愿的天空)\n[02:21.240]明日(あした)が来(く)るから (明天一定会到来)\n[02:26.060]导(みちび)いてくれた 光(ひかり)は 君(きみ)だよ (你就是指引我前进的光)\n[02:32.110]つられて僕(ぼく)も走(はし)り出(だ)した (终于使我也开始向前奔跑)\n[02:36.950]知(し)らぬ间(ま)に クロスし始(はじ)めた (不知不觉间 我们开始交织在一起)\n[02:42.990]ほら 今(いま)だ ここで 光(ひか)るなら (现在 就在这里 若能绽放光芒！)\n[02:49.830]君(きみ)だよ 君(きみ)なんだよ (是你哦 就是你哟)\n[02:52.790]教(おし)えてくれた (告诉了我)\n[02:55.770]暗闇(くらやみ)は终(お)わるから (黑夜终将结束)\n[03:01.770]君(きみ)だよ 君(きみ)なんだよ (是你哦 就是你哟)\n[03:04.810]教(おし)えてくれた (告诉了我)\n[03:07.950]暗闇(くらやみ)も光(ひか)るなら (若能在黑暗中绽放光芒)\n[03:10.870]星空(ほしぞら)になる (就会如星空般闪亮)\n[03:13.890]悲(かな)しみを笑颜(えがお)に (被悲伤掩盖的笑容)\n[03:16.700]もう隠(かく)さないで (已经无需隐藏)\n[03:19.830]煌(きら)めくどんな星(ほし)も (闪耀的星光)\n[03:22.770]君(きみ)を照(て)らすから (会为你指引方向)\n[03:27.310]答(こた)えはいつでも 偶然(ぐうぜん)?必然(ひつぜん)? (答案是偶然？必然？)\n[03:32.610]いつか選(えら)んだ道(みち)こそ (总有一天你会选择这条道路)\n[03:36.550]運命(うんめい)になる (那将成为命运)\n[03:39.600]握(にぎ)りしめたその希望(きぼう)も不安(ふあん)も (握在手心的希望也好不安也罢)\n[03:44.570]きっと二人(ふたり)を動(うご)かす 光(ひかり)になるから (必定会化作驱使我们前进的光)\n"
            }
        });
        ap7.init();
    }
    if (document.getElementById('player5')) {
        var ap5 = new APlayer({    //2419
            element: document.getElementById('player5'),
            autoplay: false,
            showlrc: 1,
            music: {
                title: '九九八十一',
                author: '肥皂菌',
                url: 'https://dn-diygod.qbox.me/九九八十一.mp3',
                pic: 'https://dn-diygod.qbox.me/九九八十一.jpg',
                lrc: "[00:58.86]上路 巩州遇虎熊\n[01:01.04]五百年前一场疯 腾宵又是孙悟空\n[01:05.16]失马 鹰愁涧飞白龙\n[01:07.54]沙河阻断路难通 福陵山中收天蓬\n[01:11.72]岭上 前行逆黄风\n[01:13.88]七星不照波月洞 千年白骨化阴风\n[01:18.15]鱼篮 网通天一尾红\n[01:20.39]紫金葫芦二道童 九尾老狐敢压龙\n[01:24.79]白虹坠 雪浪击石碎\n[01:27.37]思归 难归 堕回 轮回\n[01:29.45]月满一江水 前世莫追\n[01:33.45]福泽聚宝象 春风度不让洛阳\n[01:36.50]玉面狐折兰香 七绝崖上暗伏赤色大蟒\n[01:40.36]过西梁 女儿国鸳鸯罗帐\n[01:42.89]与三道斗法相 火云扬 明枪易挡暗箭难防\n[01:46.86]十方魔 渴饮着我的脆弱\n[01:49.95]凭你计法相迫 逐个击破要你识我本色\n[01:53.25]万里恶 摧垮了我的沉默\n[01:55.94]一肩担路坎坷 我不说 又何须旁人来嚼口舌\n[02:01.77]借扇 翠云访罗刹\n[02:04.14]碧波潭内结亲宴 招来九头的驸马\n[02:08.11]雾隐 金斑豹伸利爪\n[02:10.49]城北黄狮盗钉耙 白毛小鼠偷烛花\n[02:14.63]思乡 未敢听琵琶\n[02:16.56]摄魂曲后三股叉 一朝命断美人画\n[02:20.84]六耳 幻形难辨真假\n[02:23.06]太岁摇铃唤风沙 玉兔抛绣高台搭\n[02:27.49]红霓垂 九重紫云飞\n[02:30.15]久归 未归 欲回 恨回\n[02:32.64]凡胎恰登对 天命难违\n[02:36.37]比丘走白鹿 十三娘情丝缠缚\n[02:39.18]乌袍君生百目 庙前拦路自称黄眉老祖\n[02:43.19]将云拂 孤直公对谈诗赋\n[02:45.60]还未能抵天竺 金平府 钺斩红尘斧辟寒暑\n[02:49.71]众笔者 嘲笑着我的贪得\n[02:52.07]藏美酒有甚者 谁却敢说自己放肆醉过\n[02:55.98]休怪我 这半生痴情煞多\n[02:58.61]活一遭风流客 慕娇娥 但愿抱拥世间真绝色\n[03:29.59]浮世千寻沫 冲荡了我的轮廓\n[03:32.45]纵身入尘埃里 雷雨大作我也放声而歌\n[03:36.18]方寸中 方寸却不能定夺\n[03:38.80]七十二般胆魄 这次我决意不闪躲\n[03:42.40]世尊如来佛 诘问着我的执着\n[03:45.54]当年我瑶池刻 闹得痛快并未想过太多\n[03:49.14]状罪责 拿捏了我的业果\n[03:51.89]可顽心不服错 不思过 齐天大圣地上行者\n[03:55.63]那传说 忘却了我的寂寞\n[03:58.44]英雄名不堪得 何必较我混沌徒费口沫\n[04:01.64]这人间 毕竟我真正走过\n[04:04.87]一途平九百波 九千错 凌云渡成正果但我\n[04:08.72]有九九八十一种不舍"
            }
        });
        ap5.init();
    }

    if (document.getElementById('player4')) {
        var ap4 = new APlayer({    // 2361
            element: document.getElementById('player4'),
            autoplay: false,
            showlrc: 1,
            music: {
                title: '回レ！雪月花',
                author: '小倉唯',
                url: 'https://dn-diygod.qbox.me/回レ！雪月花.mp3',
                pic: 'https://dn-diygod.qbox.me/回レ！雪月花.jpg',
                lrc: "[by:京兆万年]\n[ti:回レ!雪月花 小紫ver.]\n[ar:小倉唯]\n[lr:ヒゲドライバー]\n[co:ヒゲドライバー]\n[ag:ヒゲドライバー]\n[00:00.00]せ〜の　いちにっさんはい！（预~备 一 二 三 嗨！）\n[00:04.68]ほい！　いよーーーーっ　ぽん！（嘿 咿哟 嘭）\n[00:07.66]ハッハッハッハッハッハッハィヤ（哈 哈 哈 哈 哈 哈 嗨呀）\n[00:11.12]ハッハッハッハッハッハッ　う～（哈 哈 哈 哈 哈 哈 呜~）\n[00:13.36]さぁさぁさぁ（来 来 来）\n[00:14.08]これよりご覧いただきますは（接下来诸位将欣赏到的是）\n[00:15.65]カブキ者たちの栄枯盛衰（歌舞伎演员们的荣辱盛衰）\n[00:17.14]時代常に日進月歩（时代总是在日新月异）\n[00:18.24]聞いてってよ老若男女（且听我一一道来 男女老少）\n[00:20.14]一見は勧善懲悪（乍一看是惩恶扬善）\n[00:21.49]悪者どもを一刀両断（将坏人们一刀两断）\n[00:22.85]「でもホンドにそれだけで楽しいの？」（“但是你真的会因此而觉得扬眉吐气吗？”）\n[00:25.63]もうなんだって蒟蒻問答（无论问什么 都是牛头马嘴）\n[00:27.58]ハッハッハッハッハッハッハィヤ（哈哈哈哈哈哈 咿呀）\n[00:30.57]ハッハッハッハッ（哈哈哈哈）\n[00:31.97]いよーーーーっ　ぽん！（咿哟 嘭）\n[00:33.61]どこからともなく現れて（自何处出现委实难料）\n[00:34.96]すぐどこかへ行っちゃって神出鬼沒（眼又遁隐他处总是神出鬼没）\n[00:36.35]チャンスを待ったら一日千秋（若是静候机会 便是一日千秋）\n[00:38.03]追いかければ東奔西走（追上前去的话又要东奔西走）\n[00:39.68]時代常に千変万化（时代总是千变万化）\n[00:40.95]人の心は複雑怪奇（世人之心复杂怪奇）\n[00:42.31]「でも本気でそんなこ言ってんの？」（“但是说着这些话的你岂不也是难免戏谑?”）\n[00:45.02]もうどうにも満身創痍（也罢 无论怎样都将满身疮痍）\n[00:46.98]嗚呼、巡り巡って夜の町（呜呼 绕来绕去相会在这夜色下的街）\n[00:53.27]キミは合図出し踊りだす（（由）你发出信号 （让）我们一同起舞转）\n[00:58.12]はぁ～（哈呜~）\n[00:58.88]回レ回レ回レ回レ回レ回レ回レ回レ回レ！（旋转吧旋转吧旋转吧旋转吧旋转吧旋转吧旋转吧旋转吧旋转吧！）\n[01:02.12]華麗に花弁　散らすように（在散落的美丽花瓣中）\n[01:04.97]回レ回レ回レ回レ回レ回レ回レ回レ回レ！（旋转吧旋转吧旋转吧旋转吧旋转吧旋转吧旋转吧旋转吧旋转吧！）\n[01:08.13]髪も振り乱して（头发凌乱又怎样？）\n[01:10.23]一昨日、昨日、今日と、明日と、明後日と（前日、昨日、今日、明日、后日）\n[01:14.13]この宴は続く（这场宴会亦不息）\n[01:16.31]踊レ、歌エ、一心不乱に回レ！（舞动吧 歌唱吧 一心不乱的旋转吧于）\n[01:20.19]今宵は雪月花（今夜的雪月花）\n[01:25.43]ほい！　いよーーーーっ　ぽん！（哈～!～哟ーーーー～嘣～!）\n[01:29.14]ハッハッハッハッハッハッハィヤ（哈 哈 哈 哈 哈 哈 嗨呀）\n[01:32.16]ハッハッハッハッハッハッ　う～（哈 哈 哈 哈 哈 哈 呜）\n[01:34.39]ねぇねぇねぇ（呐～呐～呐～）\n[01:35.12]この世に平安訪れるの？（平安已经访问此世了吗?）\n[01:36.50]のべつ幕無し丁丁発止（不会闭幕的丁当争斗）\n[01:38.09]兵ども千客万来（官兵们接踵而来）\n[01:39.50]ひしめき合群雄割拠（相互吵吵嚷嚷群雄割据）\n[01:41.00]伸るか反るか一攫千金（成败在于敢否一举千金）\n[01:42.47]気が付いたら絶体絶命（回过头来却已穷途末路）\n[01:43.50]「でも本音のとこ、どうなってんの？」（「不过真心的所在、到底是什么样呢?」）\n[01:46.62]もうまったく奇想天外（真是的总这么异想天开）\n[01:48.51]嗚呼、辿り辿って夜の町（呜呼、追溯于夜晚小镇上）\n[01:54.83]迷い一つなく踊りだす（心无杂念的就此起舞吧）\n[01:59.68]はぁ～（哈阿～）\n[02:00.44]回レ回レ回レ回レ回レ 回レ回レ回レ回レ！（转啊转啊转啊转啊转啊转啊转啊转啊转啊!）\n[02:03.64]華麗に花弁　散らすように（犹如花瓣华丽的散落一般）\n[02:06.49]回レ回レ回レ回レ回レ 回レ回レ回レ回レ！（转啊转啊转啊转啊转啊转啊转啊转啊转啊!）\n[02:09.66]髪も振り乱して（长发也随风飘散）\n[02:11.72]一昨日、昨日、今日と、明日と、明後日と（无论前天、昨天、还是今天、明天、与后天）\n[02:15.63]この宴は続く（这宴会还会持续）\n[02:17.67]踊レ、歌エ、一心不乱に回レ！（跳吧、唱吧、一心一意的转吧!）\n[02:21.60]今宵は雪月花（因为今宵乃是雪月花）\n[02:36.74]ハッハッハッハッハッハッハィヤ（哈 哈 哈 哈 哈 哈 嗨呀）\n[02:39.72]ハッハッハッハッハッハッ　さぁさぁさぁ（哈 哈 哈 哈 哈 哈 来～来～来～）\n[02:42.45]ハッハッハッハッハッハッハィヤ（哈 哈 哈 哈 哈 哈 嗨呀）\n[02:45.49]ハッハッハッハッハッハッ（哈 哈 哈 哈 哈 哈）\n[02:47.66]花で一つ、鳥で二つ（花就是一、鸟就是二）\n[02:51.31]手打ち鳴らす（拍着手轻声唱）\n[02:54.12]風で三つ、嗚呼、月出て四つ（风就是三、呜呼、月出就有四）\n[02:58.76]鳴らす鳴らす……（轻声唱轻轻唱……）\n[03:00.09]花で一つ、鳥で二つ（花就是一、鸟就是二）\n[03:03.34]手打ち鳴らす（拍着手轻声唱）\n[03:06.25]風で三つ、嗚呼、月出て四つ（风就是三、呜呼、月出就有四）\n[03:10.78]鳴らす鳴らす……（轻轻唱轻声唱……）\n[03:13.28]今は（在此）\n[03:15.35]回レ回レ回レ回レ回レ 回レ回レ回レ回レ！（转啊转啊转啊转啊转啊转啊转啊转啊转啊!）\n[03:18.63]華麗に花弁　散らすように（犹如花瓣华丽的散落一般）\n[03:21.35]回レ回レ回レ回レ回レ 回レ回レ回レ回レ！（转啊转啊转啊转啊转啊转啊转啊转啊转啊!）\n[03:24.60]髪も振り乱して（长发也随风飘散）\n[03:26.72]一昨日、昨日、今日と、明日と、明後日と（无论前天、昨天、还是今天、明天、与后天）\n[03:30.67]この宴は続く（这宴会不会结束）\n[03:32.75]踊レ、歌エ、一心不乱に回レ！（跳吧、唱吧、一心一意的转吧!）\n[03:36.63]今宵は何曜日か？（今宵是星期几呢?）\n[03:39.02]水木金？（三四五?）\n[03:40.56]土日月火？（六七一二?）\n[03:44.11]ハッハッハッハッハッハッハィヤ（哈 哈 哈 哈 哈 哈 嗨呀）\n[03:47.00]ハッハッハッハッ（哈 哈 哈 哈 哈 哈）\n[03:48.57]いよーーーーっ　ぽん！（～哟ーーーー～嘣～!）\n[03:50.43]-終わり-（-End-）"
            }
        });
        ap4.init();
    }

    if (document.getElementById('player3')) {
        var ap3 = new APlayer({    // 2322
            element: document.getElementById('player3'),
            autoplay: false,
            showlrc: 1,
            music: {
                title: 'secret base ~君がくれたもの~',
                author: '茅野愛衣',
                url: 'https://dn-diygod.qbox.me/secretbase.mp3',
                pic: 'https://dn-diygod.qbox.me/secretbase.jpg',
                lrc: "[00:00.230]君と夏の終わり 将来の夢（与你在夏末约定　将来的梦想）\n[00:04.170]大きな希望 忘れない（远大的希望　不要忘记了）\n[00:07.170]10年後の8月（我相信　十年後的八月）\n[00:09.700]また出会えるのを 信じて（我们还能再相遇）\n[00:14.360]最高の思い出を…（共划美好的回忆）\n[00:39.960]出会いは ふっとした 瞬間 帰り道の交差点で（相识　是那麼不经意的瞬间　我在回家途中的十字路口）\n[00:47.050]声をかけてくれたね 「一緒に帰ろう」（听见你的一声〞一起回家吧〞）\n[00:54.310]僕は 照れくさそうに カバンで顔を隠しながら（我当时有点尴尬　还拿书包遮著脸）\n[01:01.470]本当は とても とても 嬉しかったよ（其实我　心里好高兴　真的好高兴）\n[01:08.590]あぁ 花火が夜空 きれいに咲いて ちょっとセツナク（啊！烟火在夜空中　灿烂盛开　几许伤感）\n[01:15.770]あぁ 風が時間とともに 流れる（啊！风随着时光流逝）\n[01:22.580]嬉しくって 楽しくって 冒険も いろいろしたね（满心欢喜地　兴致冲冲地　我们四处探险）\n[01:29.760]二人の 秘密の 基地の中（就在我们的　秘密基地中）\n[01:36.740]君と夏の終わり 将来の夢 大きな希望 忘れない（与你在夏末约定　将来的梦想　远大的希望　不要忘记了）\n[01:43.920]10年後の8月 また出会えるのを 信じて（我相信　十年後的八月　我们还能再相遇）\n[01:51.010]君が最後まで 心から 「ありがとう」叫んでいたこと（我知道　一直到最後）\n[01:56.930]知っていたよ（你仍在心底呼喊著〞谢谢你〞）\n[01:58.200]涙をこらえて 笑顔でさようなら せつないよね（强忍著泪水　笑著说再见　无限感叹涌现）\n[02:05.420]最高の思い出を…（那一段最美好的回忆…）\n[02:13.070]あぁ 夏休みも あと少しで 終っちゃうから（啊！暑假就快要过完了）\n[02:20.310]あぁ 太陽と月 仲良くして（啊！太阳和月亮　默契十足）\n[02:27.080]悲しくって 寂しくって 喧嘩も いろいろしたね（想到令人悲伤　或许有些寂寥　我们也多有争吵）\n[02:34.160]二人の 秘密の 基地の中（就在我们的　秘密基地中）\n[02:41.140]君が最後まで 心から 「ありがとう」叫んでいたこと（我知道　一直到最後）\n[02:47.000]知っていたよ（你仍在心底呼喊著〞谢谢你）\n[02:48.340]涙をこらえて 笑顔でさようなら せつないよね（强忍著泪水　笑著说再见　无限感叹涌现）\n[02:55.630]最高の思い出を…（那一段最美好的回忆）\n[03:03.320]突然の 転校で どうしようもなく（你突然要转学　你我都可奈何）\n[03:24.190]手紙 書くよ 電話もするよ 忘れないでね 僕のことを（我会写信给你　也会打电话给你　千万不要忘记我）\n[03:31.420]いつまでも 二人の 基地の中（永远别忘记　那段在秘密基地中的日子）\n[03:38.520]君と夏の終わり ずっと話して（与你在夏末　聊了这麼多）\n[03:42.530]夕日を見てから星を眺め（从黄昏到繁星点点）\n[03:45.670]君の頬を 流れた涙は ずっと忘れない（流过你双颊的泪水　我永远不会忘记）\n[03:52.820]君が最後まで 大きく手を振ってくれたこと（直到最後　你紧紧握住我的手　这感觉也将长在我心中）\n[03:58.540]きっと忘れない（於是就这样）\n[03:59.930]だから こうして 夢の中で ずっと永遠に…（让我们在梦中相会吧　永远的…）\n[04:07.110]君と夏の終わり 将来の夢 大きな希望 忘れない（与你在夏末约定　将来的梦想　远大的希望　不要忘记了）\n[04:14.270]10年後の8月 また出会えるのを 信じて（我相信　十年後的八月　我们还能再相遇）\n[04:21.400]君が最後まで 心から 「ありがとう」叫んでいたこと（我知道　一直到最後）\n[04:27.260]知っていたよ（你仍在心底呼喊著〞谢谢你〞）\n[04:28.640]涙をこらえて 笑顔でさようなら せつないよね（强忍著泪水　笑著说再见　无限感叹涌现）\n[04:35.910]最高の思い出を…（那一段最美好的回忆…）\n[04:43.160]最高の思い出を…（那一段最美好的回忆…）"
            }
        });
        ap3.init();
    }

    if (document.getElementById('player2')) {
        var ap2 = new APlayer({    // 2167
            element: document.getElementById('player2'),
            autoplay: false,
            music: {
                title: 'Preparation',
                author: 'Hans Zimmer/Richard Harvey',
                url: 'https://dn-diygod.qbox.me/Preparation.mp3',
                pic: 'https://dn-diygod.qbox.me/Preparation.jpg'
            }
        });
        ap2.init();
    }

    // evanyou
    var c = document.getElementById('evanyou'),
        x = c.getContext('2d'),
        pr = window.devicePixelRatio || 1,
        w = window.innerWidth,
        h = window.innerHeight,
        f = 90,
        q,
        m = Math,
        r = 0,
        u = m.PI*2,
        v = m.cos,
        z = m.random
    c.width = w*pr
    c.height = h*pr
    x.scale(pr, pr)
    x.globalAlpha = 0.6
    function evanyou(){
        x.clearRect(0,0,w,h)
        q=[{x:0,y:h*.7+f},{x:0,y:h*.7-f}]
        while(q[1].x<w+f) d(q[0], q[1])
    }
    function d(i,j){
        x.beginPath()
        x.moveTo(i.x, i.y)
        x.lineTo(j.x, j.y)
        var k = j.x + (z()*2-0.25)*f,
            n = y(j.y)
        x.lineTo(k, n)
        x.closePath()
        r-=u/-50
        x.fillStyle = '#'+(v(r)*127+128<<16 | v(r+u/3)*127+128<<8 | v(r+u/3*2)*127+128).toString(16)
        x.fill()
        q[0] = q[1]
        q[1] = {x:k,y:n}
    }
    function y(p){
        var t = p + (z()*2-1.1)*f
        return (t>h||t<0) ? y(p) : t
    }
    document.onclick = evanyou
    document.ontouchstart = evanyou
    evanyou()

    // OwO
    if (document.getElementsByClassName('content-field').length) {
        new OwO({
            logo: 'OωO表情',
            container: document.getElementsByClassName('content-field')[0].getElementsByClassName('OwO')[0],
            target: document.getElementById('comment-content')
        });
    }

    // blogChat
    function htmlspecialchars(str){
        str = str.replace(/&/g, '&amp;');
        str = str.replace(/</g, '&lt;');
        str = str.replace(/>/g, '&gt;');
        str = str.replace(/"/g, '&quot;');
        str = str.replace(/'/g, '&#039;');
        return str;
    }
    var ChatRoomClient = function() {
        this.users = [];
        this.totalCount = 0;
        // this.socket = io.connect('http://123.56.230.53:29231/');
        this.socket = io.connect();
        this.startup();
        this.init();
    };

    ChatRoomClient.prototype.init = function() {
        this.connection();
        this.socketEvent();
        this.bindEvent();
        this.addInfoLog({
            msg: '注意：聊天日志不会保存，请注意备份.'
        }, 'group');
        this.addInfoLog({
            msg: '提示：点击头像可进入私聊'
        }, 'group');
    };

    ChatRoomClient.prototype.startup = function() {
        var xtpl = [
            '<div class="chatroom">',
            '<div class="chatroom-feedback"><a href="https://github.com/barretlee/blogChat" target="_blank">源码</a> | <a href="https://github.com/barretlee/blogChat/issues/new" target="_blank">反馈</a></div>',
            '<div class="chatroom-info"></div>',
            '<ul class="chatroom-tribes">',
            '<li class="chatroom-tribe current" data-id="group">',
            '<span class="name">当前 <strong>1</strong> 人群聊</span>',
            '<span class="count">0</span>',
            '</li>',
            '</ul>',
            '<div class="chatroom-pannels">',
            '<div class="chatroom-pannel-bd">',
            '<div class="chatroom-item current" data-id="group">',
            '</div>',
            '</div>',
            '<div class="chatroom-pannel-ft"><textarea type="text" class="chatroom-input" placeholder="按 Ctrl+Enter 发送"></textarea><span class="chatroom-send-btn">发送</span></div>',
            '</div>',
            '</div>'
        ].join('\n');
        $('html').append(xtpl);
    }

    ChatRoomClient.prototype.connection = function(cb) {
        var self = this;

        self.socket.on('connected', function(data) {
            self.userId = data.id;
            self.userName = self.userId.slice(2);
            self.userAvatar = 'http://avatar.duoshuo.com/avatar-50/292/117200.jpg';
            if(window.DUOSHUO && window.DUOSHUO.visitor
                && window.DUOSHUO.visitor.data.user_id) {
                var userInfo = window.DUOSHUO.visitor.data;
                self.userId = userInfo.user_id;
                self.userName = userInfo.name;
                self.userAvatar = userInfo.avatar_url;
            } else if($.cookie && ($.cookie('visitor') || $.cookie('visitor_history'))) {
                var info = $.cookie('visitor') || $.cookie('visitor_history');
                try {
                    var info = JSON.parse(info);
                    if(info.id && info.name && info.avatar) {
                        self.userId = info.id;
                        self.userName = info.name;
                        self.userAvatar = info.avatar;
                    }
                } catch(e) {}
            } else {
                if(window.sessionStorage) {
                    var userId = window.sessionStorage.getItem('userId');
                    if(userId) {
                        self.userId = userId;
                        self.userName = userId.slice(2);
                    } else {
                        window.sessionStorage.setItem('userId', self.userId);
                    }
                }
            }
            if(window.sessionStorage) {
                window.sessionStorage.setItem('userId', self.userId);
            }
            self.changeName();
            // console.info('ID: ' + self.userId);
            self.socket.emit('createUser', {
                userId: self.userId,
                userName: self.userName,
                userAvatar: self.userAvatar
            });
        });
    };

    ChatRoomClient.prototype.checkRobot = function() {
        var i = 0;
        while(i++ < 1E3) {
            clearInterval(i);
        }
        if(document.visibilityState && document.visibilityState !== 'visible') {
            return false;
        }
        return true;
    };

    ChatRoomClient.prototype.changeName = function() {
        if($('.chatroom-rename').size()) return;
        var self = this;
        var str = '<div class="chatroom-rename" style="display:none;"><input type="text" value="' +
            htmlspecialchars(self.userName) +'" placeholder="不要取太长的名字啦~"><span>确认</span></div>';
        $(str).appendTo($('.chatroom')).fadeIn();
        $('.chatroom-rename span').on('click', function() {
            var $input = $('.chatroom-rename input');
            if($.trim($input.val())) {
                self.userName = $input.val().slice(0, 20);
                self.socket.emit('createUser', {
                    userId: self.userId,
                    userName: self.userName,
                    userAvatar: self.userAvatar
                });
                $('.chatroom-rename').remove();
            }
        });
    };

    ChatRoomClient.prototype.socketEvent = function() {
        var self = this;
        self.socket.on('broadcast', function(data) {
            if(data.id == self.userId) return;
            if(data.type == 'NEW') {
                if($.inArray(data.id, self.users) > -1) return false;
                self.users.push(data.id);
                return self.addWelcomeLog(data);
            }
            // if(data.type == 'LEAVE') {
            //   return self.addInfoLog(data);
            // }
            self.addChatLog(data, 'group');
            self.updateCount('group');
        });
        self.socket.on('pm', function(data) {
            if(data.type == 'OFFLINE') {
                return self.addInfoLog(data, data.id);
            }
            if($('.chatroom-fold').size()) {
                var str = "<img class='alert-avatar' src='" +
                    htmlspecialchars(data.avatar) + "'>" + htmlspecialchars(data.name) + "の私信，右下角查看";
                window.operation && operation.alertMsg(str);
            }
            self.createPrivateChat(data);
            self.addChatLog(data, data.id);
            self.updateCount(data.id);
        });
        self.socket.on('pong', function(data) {
            var type = data.type;
            if(type === 'PONG') {
                $('.chatroom-tribe .name strong').text(data.count);
                if($('.chatroom').hasClass('chatroom-fold') && this.totalCount) {
                    $('.chatroom .count').eq(0).text(this.totalCount).css('visibility', 'visible');
                }
            } else if(type === 'PING-BACK') {
                console.warn(data);
            }
        });
    };

    ChatRoomClient.prototype.bindEvent = function() {
        var self = this;
        $('.chatroom').on('keydown', function(evt) {
            if(evt.keyCode == 27) {
                $(this).addClass('chatroom-fold');
            }
        });
        $('.chatroom-input').on('keydown', function(evt) {
            var $this = $(this);
            if((evt.ctrlKey || evt.metaKey) && evt.keyCode == '13' && $.trim($this.val()) || evt.isTrigger) {
                var targetId = $('.chatroom-tribe.current').attr('data-id');
                var data = {
                    id: self.userId,
                    msg: $this.val(),
                    name: self.userName,
                    avatar: self.userAvatar,
                    targetId: targetId
                };
                if(!self.checkRobot()) return;
                self.socket.emit(targetId == 'group' ? 'gm' : 'pm', data);
                self.addChatLog(data, targetId, true);
                $this.val('');
                return false;
            }
        });
        $('.chatroom-send-btn').on('click', function(evt) {
            $('.chatroom-input').trigger('keydown');
        });
        $('.chatroom-tribes').on('click', 'li', function(evt) {
            evt.preventDefault();
            var id = $(this).attr('data-id');
            var $target = $('.chatroom-item[data-id="' + id + '"]');
            $('.chatroom-tribes').find('li').removeClass('current');
            $('.chatroom-item').removeClass('current');
            $(this).addClass('current');
            $target.addClass('current').scrollTop(1E5);
            $(this).find('.count').text(0).css('visibility', 'hidden');
            var count = parseInt($(this).find('.count').text());
            count = isNaN(count) ? 0 : +count;
            this.totalCount -= count;
            setTimeout(function() {
                $('.chatroom textarea').focus();
            }, 10);
            $('.chatroom-pannel-bd').scrollTop($target.attr('data-lastscroll'));
        });
        $('.chatroom-tribes').on('click', 'i', function(evt) {
            evt.preventDefault();
            evt.stopImmediatePropagation();
            var $p = $(this).parent('li');
            var id = $p.attr('data-id');
            $p.remove();
            $(".chatroom-item[data-id='" + id + "']").remove();
            $('.chatroom-item').removeClass('current');
            $('.chatroom-item[data-id="group"]').addClass('current');
            $('.chatroom-tribe[data-id="group"]').addClass('current');
            var count = parseInt($(this).find('.count').text());
            count = isNaN(count) ? 0 : +count;
            this.totalCount -= count;
            $('.chatroom-pannel-bd').scrollTop(1E5);
        });
        $(".chatroom-item").on('click', '.avatar, .time, .name', function(evt) {
            evt.preventDefault();
            evt.stopImmediatePropagation();
            var $this = $(this);
            var $p = $this.parent('.chatroom-log');
            var avatar = $p.find('.avatar img').attr('src');
            var name = $p.find('.time b').text();
            var id = $p.find('.time b').attr('data-id');
            if(id === self.userId) return;
            if($this.parent().hasClass('chatroom-log-welcome')) {
                $p = $this.parent();
                id = $p.attr('data-id');
                avatar = $p.find('.avatar').attr('src');
                name = $p.find('.name').text();
            }
            self.createPrivateChat({
                avatar: avatar,
                name: name,
                id: id
            }, true);
            self.addInfoLog({
                msg: '与 ' + name + ' 私聊'
            }, id);
        });
        $(".chatroom-info").on('click', function(evt) {
            evt.preventDefault();
            // $('.chatroom').toggleClass('chatroom-fold');
            if(!$('.chatroom').hasClass('chatroom-fold')) {
                $('.chatroom').addClass('chatroom-fold');
                $('.chatroom textarea').focus();
                $('.chatroom-tribe').removeClass('current');
                $('.chatroom-item').removeClass('current');
                $('.chatroom-tribes>li').first().addClass('current');
                $('.chatroom-item').first().addClass('current');
                $('.chatroom .count').eq(0).text(0).css('visibility', 'hidden');
            } else {
                $('.chatroom').removeClass('chatroom-fold');
            }
        });
        if(/Mac OS/i.test(navigator.appVersion)) {
            $(".chatroom textarea").attr('placeholder', '按 Command+Enter 发送');
        }
        $(window).on('beforeunload close', function() {
            self.socket.emit('disconnet', {
                id: self.userId
            });
        });
    };

    ChatRoomClient.prototype.ping = function() {
        this.socket.emit('ping', {
            id: this.userId
        });
    };

    ChatRoomClient.prototype.createPrivateChat = function(data, setCurrent) {
        if($('.chatroom-item[data-id="' + data.id + '"]').size()) return;
        var tabXtpl = [
            '<li class="chatroom-tribe" data-id="<% id %>">',
            '<img src="<% avatar %>" alt="<% name %>">',
            '<span class="name"><% name %></span>',
            '<span class="count">0</span>',
            '<i class="iconfont">╳</i>',
            '</li>'
        ];
        var $li = tabXtpl.join('').replace(/<%\s*?(\w+)\s*?%>/gm, function($0, $1) {
            return htmlspecialchars(data && data[$1] || '');
        });
        $(".chatroom-tribes").append($li);
        var id = data && data.id;
        var $pannel = '<div class="chatroom-item" data-id="' + id + '"></div>';
        $(".chatroom-pannel-bd").append($pannel);
        if(setCurrent) {
            $('.chatroom-tribe').removeClass('current');
            $('.chatroom-item').removeClass('current');
            $('.chatroom-tribes>li').last().addClass('current');
            $('.chatroom-item').last().addClass('current');
        }
        if(data.targetId) {
            this.addInfoLog({
                msg: '与 ' + htmlspecialchars(data.name) + ' 私聊'
            }, data.targetId);
        }
    };

    ChatRoomClient.prototype.addChatLog = function(data, id, isSelf) {
        if(isSelf) {
            data.name = '我';
        }
        var logXtpl = [
            '<div class="chatroom-log' + (isSelf ? ' myself' : '') + '">',
            '<span class="avatar"><img src="<% avatar %>" alt="<% name %>"></span>',
            '<span class="time"><b data-id="<% id %>"><% name %></b> ' + new Date().toLocaleString() + '</span>',
            '<span class="detail"><% msg %></span>',
            '</div>'
        ];
        var $log = logXtpl.join('\n').replace(/<%\s*?(\w+)\s*?%>/gm, function($0, $1) {
            if($1 === 'avatar' && (!data || !data[$1])) {
                return 'http://avatar.duoshuo.com/avatar-50/292/117200.jpg';
            }
            return htmlspecialchars(data && data[$1] || '');
        });
        var $target = $(".chatroom-item[data-id='" + id + "']");
        $target.append($log);
        this.scroll(id, isSelf);
    };

    ChatRoomClient.prototype.scroll = function(id, isSelf) {
        var $target = $(".chatroom-item[data-id='" + id + "']");
        var $box = $('.chatroom-pannel-bd');
        var H = $target.height();
        var DELTA = 300;
        if(isSelf || $box.scrollTop() < H - DELTA) {
            $box.scrollTop(H);
            $target.attr('data-lastscroll', H);
        }
    }

    ChatRoomClient.prototype.addInfoLog = function(data, id) {
        var $info = '<div class="chatroom-log-info">' + htmlspecialchars(data.msg) + '</div>';
        var $target = $(".chatroom-item[data-id='" + htmlspecialchars(id) + "']");
        // $target.append($info).scrollTop(1E5);
        this.scroll(id);
    };

    ChatRoomClient.prototype.addWelcomeLog = function(data) {
        var $info = '<div class="chatroom-log-info chatroom-log-welcome" data-id="' +
            htmlspecialchars(data.id) + '">欢迎 <img class="avatar" src="' + htmlspecialchars(data.avatar)
            + '"><strong class="name">' + htmlspecialchars(data.name) + '</strong> 加入群聊！</div>';
        var $target = $(".chatroom-item[data-id='group']");
        // $target.append($info).scrollTop(1E5);
        this.scroll(data.id);
    };

    ChatRoomClient.prototype.updateCount = function(id) {
        var $li = $('.chatroom-tribe[data-id="' + id + '"]');
        // if(!$li.size() || $li.hasClass('current')) return;
        var $target = $li.find('.count');
        var count = parseInt($target.text());
        count = isNaN(count) ? 0 : +count;
        if(++count > 99) {
            count = 99;
        }
        $target.text(count).css('visibility', 'visible');
        this.totalCount++;
        if(this.totalCount > 99) {
            this.totalCount = 99;
        }
        if($('.chatroom').hasClass('chatroom-fold')) {
            $('.chatroom .count').eq(0).text(this.totalCount).css('visibility', 'visible');
        }
    };

    window.chatRoomClient = new ChatRoomClient();
});

// 博客已运行XXX
function show_date_time() {
    window.setTimeout("show_date_time()", 1000);
    var BirthDay = new Date("2/9/2014 11:30:00");
    var today = new Date();
    var timeold = (today.getTime() - BirthDay.getTime());
    var msPerDay = 24 * 60 * 60 * 1000;
    var e_daysold = timeold / msPerDay;
    var daysold = Math.floor(e_daysold);
    var e_hrsold = (e_daysold - daysold) * 24;
    var hrsold = Math.floor(e_hrsold);
    var e_minsold = (e_hrsold - hrsold) * 60;
    var minsold = Math.floor((e_hrsold - hrsold) * 60);
    var seconds = Math.floor((e_minsold - minsold) * 60);
    span_dt_dt.innerHTML = daysold + "天" + hrsold + "小时" + minsold + "分" + seconds + "秒";
}