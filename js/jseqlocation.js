function seq_location(element, width, height, seqs, options = null) {
	// Get setttings from options or default values.
	var defaults = {
		"colors": {"+": "green", "-": "blue", },
		"textcolor": "black",
		"bgcolor": "white",
		"padding": 6,
		"lineheight": "16px",
		"labelfont": "12px \"Lucida Console\", Monaco, monospace"
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
	upstreamstrt = upstreamstrt - (0.1*upstreamstrt);
	downstreamend = downstreamend + (0.1*downstreamend);	
	
	// height and width of canvas
	totalheight = seqs.length * height;
	console.log(totalheight);
	element.width = width;
	element.height = totalheight;
	
	// box model calculations
	textboxheight = height - (2*settings.padding);
	textboxwidth = 0.2 * width - (2*settings.padding);	
	strandboxheight = height - (2*settings.padding);
	strandboxwidth = 0.8 * width - (2*settings.padding);
	sendsestrandheight = Math.floor(strandboxheight/2);
	
	// start drawing text	
	var ctx = element.getContext("2d");
	ctx.save();
	for(i=0;i<seqs.length;i++) {
		var p = settings.padding*(2*i+1);
		var wraptextx = (p+(textboxheight*(i+1)))-(textboxheight/2);
		wrapText(ctx, seqs[i]['sequence_id'], settings.padding, wraptextx, textboxwidth, settings.lineheight);
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