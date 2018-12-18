jseqlocation
========

Simple Javascript sequence block location visualization using vanilla JS.

## Usage

```html
<!DOCTYPE html>
<html lang="en">
    <body>
        <canvas id="location_canvas"></canvas>

        <script src="js/jseqlocation.js"></script>
        <script>
            var columns = {
			    sequence: {
				    // start, end, strand sense(orientation)
					[5, 56, "+"],
					[550, 560, "+"],
					[255, 235, "-"],
					[100, 85. "-"]								
				}
			};						

            var options = {
                "ymax": 1
            };

            sequence_logo(document.getElementById("location_canvas"), 600, 200, columns, options);
        </script>
    </body>
</html>
```
