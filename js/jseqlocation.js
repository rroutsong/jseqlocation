function seq_location(element, width, height, seqs, options = null) {
	// Get setttings from options or default values.
	var defaults = {
		"colors": {"+": "green", "-": "blue", },
		"textcolor": "black",
		"bgcolor": "white",
		"padding": 6,
		"lineheight": "16px",
		"labelfont": "12px \"Lucida Console\", Monaco, monospace",
		"linecolor": "black"
	};
	
	var settings = {};
	for(var p in defaults) {
		settings[p] = (options[p] == null) ? defaults[p] : options[p];
	}
	
	// stat collection
	var upstreamstrt = 0;
	var downstreamend = 0;
	for(i=0;i<seqs.length;i++) {
		if(seqs[i]['start'] < upstreamstrt) {
			upstreamstrt = seqs[i]['start'];
		}
		if(seqs[i]['end'] > downstreamend) {
			downstreamend = seqs[i]['end'];
		}
	}	
	upstreamstrt = upstreamstrt - (0.2*upstreamstrt);
	downstreamend = downstreamend + (0.2*downstreamend);
	streamdelta = downstreamend - upstreamstrt;
	
	console.log("upstream start: "+ upstreamstrt);
	console.log("downstream end: "+ downstreamend);
	console.log("stream delta: "+streamdelta);
	
	
	// box model calculations
	textboxheight = height - (2*settings.padding);
	textboxwidth = 0.2 * width - (2*settings.padding);	
	strandboxheight = height - (2*settings.padding);
	strandboxwidth = 0.8 * width - (2*settings.padding);
	sendsestrandheight = Math.floor(strandboxheight/2);
	pixel2strand = Math.floor(strandboxwidth/streamdelta);
	
	// setup canvas element
	totalheight = seqs.length * height;
	element.width = width;
	element.height = totalheight;
	var ctx = element.getContext("2d");
	ctx.save();
	
	for(i=0;i<seqs.length;i++) {
		// draw sequence location labels
		ctx.fillStyle="black";
		ctx.font = settings.labelfont;
		var p = settings.padding*(2*i+1);
		var wraptextx = (p+(textboxheight*(i+1)))-(textboxheight/2);
		ctx.fillText(seqs[i]['Feature_id'], settings.padding, wraptextx);
		ctx.save();
		
		// draw strand diagram line and sense labels		
		ctx.font = "16px \"Lucida Console\", Monaco, monospace";		
		ctx.fillText("+",Math.floor(((0.2*width)+settings.padding)),Math.floor(((height/2)-8)+(height*i)));
		ctx.fillText("-",Math.floor(((0.2*width)+settings.padding)),Math.floor(((height/2)+14)+(height*i)));
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(Math.floor(0.2*width),Math.floor((height/2)+(height*i)));
		ctx.lineTo(width,Math.floor((height/2)+(height*i)));
		ctx.lineWidth = 1;
		ctx.strokeStyle = settings.linecolor;
		ctx.stroke();
		
		// draw seqence location blocks
		var seqstart = seqs[i]['start'];
		var seqend = seqs[i]['end'];
		var deltatostart = pixel2strand * (seqstart - upstreamstrt);
		
		var deltatoend = pixel2strand * (seqend - upstreamstrt);
		var boxdelta = deltatoend - deltatostart;		
		var seqboxx = 20 + deltatostart + (0.2*width) + (settings.padding);		
		var seqboxy = (seqs[i]["orientation"] == "+") ? ((height/2)+(i*height)-20) : ((height/2)+(i*height)+5);		
		var seqboxheight = 15;
		var seqboxwidth = boxdelta;
		
		ctx.fillStyle = (seqs[i]["orientation"] == "+") ? "green" : "blue";
		ctx.fillRect(seqboxx, seqboxy, seqboxwidth, seqboxheight);
		ctx.save();
	}	
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  var words = text.split(' ');
  var line = '';

  for(var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + ' ';
    var metrics = context.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
     line = testLine;
    }
  }
  context.fillText(line, x, y);
}