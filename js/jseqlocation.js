// from https://github.com/frogcat/canvas-arrow
(function(target) {
  if (!target || !target.prototype)
    return;
  target.prototype.arrow = function(startX, startY, endX, endY, controlPoints) {
    var dx = endX - startX;
    var dy = endY - startY;
    var len = Math.sqrt(dx * dx + dy * dy);
    var sin = dy / len;
    var cos = dx / len;
    var a = [];
    a.push(0, 0);
    for (var i = 0; i < controlPoints.length; i += 2) {
      var x = controlPoints[i];
      var y = controlPoints[i + 1];
      a.push(x < 0 ? len + x : x, y);
    }
    a.push(len, 0);
    for (var i = controlPoints.length; i > 0; i -= 2) {
      var x = controlPoints[i - 2];
      var y = controlPoints[i - 1];
      a.push(x < 0 ? len + x : x, -y);
    }
    a.push(0, 0);
    for (var i = 0; i < a.length; i += 2) {
      var x = a[i] * cos - a[i + 1] * sin + startX;
      var y = a[i] * sin + a[i + 1] * cos + startY;
      if (i === 0) this.moveTo(x, y);
      else this.lineTo(x, y);
    }
  };
})(CanvasRenderingContext2D);

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
	const strands = Object.entries(seqs);
	for(const [feat_id, motifs] of strands) {
		const matches = Object.entries(motifs);
		for(const [motif, locations] of matches) {
			for(i=0;i<locations.length;i++) {
				// 0: start, 1:end, 2:orientation
				if(locations[i][0] < upstreamstrt) {
					upstreamstrt = locations[i][0];
				}
				if(locations[i][1] > downstreamend) {
					downstreamend = locations[i][1];
				}
			}
		}
	}
	
	streamdelta = downstreamend - upstreamstrt;
	upstreamstrt = upstreamstrt - Math.floor(0.05*streamdelta);
	downstreamend = downstreamend + Math.floor(0.05*streamdelta);
	streamdelta = downstreamend - upstreamstrt;
	
	// box model calculations
	textboxheight = height - (2*settings.padding);
	textboxwidth = 0.2 * width - (2*settings.padding);	
	strandboxheight = height - (2*settings.padding);
	strandboxwidth = 0.8 * width - (2*settings.padding);
	sendsestrandheight = Math.floor(strandboxheight/2);
	pixel2strand = Math.floor(strandboxwidth/streamdelta);
	
	// setup canvas element
	totalheight = (Object.keys(seqs).length) * height;
	element.width = width;
	element.height = totalheight;
	var ctx = element.getContext("2d");
	ctx.save();
	seqnum = 0;
	
	for(const [feat_id, motifs] of strands) {
		// draw sequence location labels
		ctx.fillStyle="black";
		ctx.font = settings.labelfont;
		var p = settings.padding*(2*seqnum+1);
		var wraptextx = (p+(textboxheight*(seqnum+1)))-(textboxheight/2);
		ctx.fillText(feat_id, settings.padding, wraptextx);
		ctx.save();
				
		// draw strand diagram line and sense labels		
		ctx.font = "16px \"Lucida Console\", Monaco, monospace";		
		ctx.fillText("+",Math.floor(((0.2*width)+settings.padding)),Math.floor(((height/2)-8)+(height*seqnum)));
		ctx.fillText("-",Math.floor(((0.2*width)+settings.padding)),Math.floor(((height/2)+14)+(height*seqnum)));
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(Math.floor(0.2*width),Math.floor((height/2)+(height*seqnum)));
		ctx.lineTo(width,Math.floor((height/2)+(height*seqnum)));
		ctx.lineWidth = 1;
		ctx.strokeStyle = settings.linecolor;
		ctx.stroke();
		
		const matches = Object.entries(motifs);
		for(const [motif, locations] of matches) {
			for(i=0;i<locations.length;i++) {
				// 0: start, 1:end, 2:orientation
				// draw seqence location blocks
				var seqstart = locations[i][0];
				var seqend = locations[i][1];
				var deltatostart = pixel2strand * (seqstart - upstreamstrt);					
				var deltatoend = pixel2strand * (seqend - upstreamstrt);
				var boxdelta = deltatoend - deltatostart;		
				var seqboxx = 20 + deltatostart + (0.2*width) + (settings.padding);		
				var seqboxy = (locations[i][2] == "+") ? ((height/2)+(seqnum*height)-10) : ((height/2)+(seqnum*height)+10);
				var seqboxheight = 15;
				var seqboxwidth = boxdelta;
							
				ctx.fillStyle = (locations[i][2] == "+") ? "green" : "blue";
				//ctx.fillRect(seqboxx, seqboxy, seqboxwidth, seqboxheight);
				ctx.beginPath();
				var arrowctlpts = [0,3,-10,3,-10,6];
				if (locations[i][2] == "+") {
					ctx.arrow(seqboxx, seqboxy, (seqboxx+seqboxwidth), seqboxy, arrowctlpts);
				} else {
					ctx.arrow((seqboxx+seqboxwidth), seqboxy, seqboxx, seqboxy, arrowctlpts);
				}
				ctx.fill();
				ctx.save();
			}
		}
		
		seqnum++;
	}	
}