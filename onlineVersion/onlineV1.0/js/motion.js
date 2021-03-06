/**
 * Created by Eva on 2016/11/15.
 */
$(function(){
	// 币种切换菜单显示隐藏
	var  faAngleRight= $(".fa-angle-right");
	var  faAngleDown = $(".fa-angle-down");
	var  monetList = $(".money_list");
	$(".direct_arror").click(function() {
		if (faAngleRight.css("display") === "none" && monetList.css("display") === "block") {
			faAngleDown.css("display","none");
			faAngleRight.css("display","inline-block");
			monetList.css("display","none");
		} else {
			faAngleRight.css("display","none");
			faAngleDown.css("display","inline-block");
			monetList.css("display","block");
		}
	});
	
	//点击list图标 左侧边栏显示隐藏
	var leftSidebar = $("#left_sidebar");
	var rightContent = $("#right_content");
	$(".list_icon").click(function () {
		if (leftSidebar.css("width") == "168px") {
			rightContent.animate({width:'1024px'},"fast");
			leftSidebar.animate({width:'0px'},"fast");
		} else {
			leftSidebar.animate({width:'168px'},"fast");
			rightContent.animate({width:'856px'},"fast");
		}
	});

	//点击币种切换菜单币种列表 切换转换模式
	var currencyA = $(".money_list li a");
	currencyA.click(function(){
		var currencyTxt =$(this).text();
		$(".money_list").find("a[class='active']").removeClass('active');
		$(this).addClass("active");
		$(".money-subtitle").text(currencyTxt);
	});
	//文本语音朗读
	var ttsAudio = document.getElementById("tts_audio_id");//audio标签元素得操作必须用原生js，包括获取元素和修改属性 为什么呢？
	//tips:也可以用jQuery来取 但是 var ttsAudio = $("#tts_audio_id")[0] 这样才能取到，因为这里通过document.getElementById()取到的是audio对象
	//$("#tts_audio_id")取到的则是jquery对象，[0]才是对应的节点对象，所以不能直接用jquery去操作
	var ttsText,ttsSrc;
	var bbTButton = $("#oprIcon .fa-volume-up");
	var bbMButton = $("#doIcon .fa-volume-up");
	
	
	bbTButton.click(function () {
		ttsText = $("#numToChar").text();
		ttsSrc = "https://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=3&text="+ttsText;
		ttsAudio.setAttribute('src', ttsSrc);
		ttsAudio.play();
	});
	bbMButton.click(function () {
		ttsText = $("#numToMoney").text();
		ttsSrc = "https://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=3&text="+ttsText;
		ttsAudio.setAttribute('src', ttsSrc);
		ttsAudio.play();
	});
	//复制文本到剪切板
	var clipboard  ,$copysuc;
	$("#oprIcon .fa-files-o").click(function(e){
		clipboard = new Clipboard('#copyTIcon');
		clipboard.on('success', function() {
			$copysuc = $("<span class='copy-t-tips'>☺ Have been copied to the clipboard</span>");
			$("#num-t-cash").find(".copy-t-tips").remove().end().append($copysuc);
			$(".copy-t-tips").fadeOut(3000);
		});
	});
	$("#doIcon .fa-files-o").click(function(e){
		clipboard = new Clipboard('#copyMIcon');
		clipboard.on('success', function() {
			$copysuc = $("<span class='copy-m-tips'>☺ Have been copied to the clipboard</span>");
			$("#num-m-cash").find(".copy-m-tips").remove().end().append($copysuc);
			$(".copy-m-tips").fadeOut(3000);
		});
	});
	//点击custom区域左侧input框激活，显示icon
	$(".custom_input_l").click(function(){
		var tooltips;
		var parent = $(this).parent();
		if(parent.children().hasClass("tooltips")){
			parent.find(".tooltips").remove();
		}
		tooltips = "<span class='tooltips'>Please enter the replacement content, such as '①' replace '壹', enter <i class='higTips'>%壹=①%</i></span>";
		
		parent.append(tooltips);
		$(this).css({
			background:'#fff',
			border:"1px solid #ccc"
		});
		parent.find('.custom_input').css('margin-top','2px');
		parent.find('.custom_input_r').css({'height':'26','line-height':'26'});
		parent.find('.custom_check').css("visibility","visible");
	});
});



	
		

