/**
 * Mixin for drawing text in a element bounding rect
 * @module zrender/mixin/RectText
 */

define(function (require) {

    var textContain = require('../contain/text');

    var RectText = function () {};

    RectText.prototype = {
        
        constructor: RectText,

        /**
         * Draw text in a rect with specified position.
         * @param  {CanvasRenderingContext} ctx
         * @param  {Object} rect Wrapping rect
         * @return {Object} textRect Alternative precalculated text bounding rect
         */
        drawRectText: function (ctx, rect, textRect) {
            var style = this.style;
            var text = this.style.text;
            if (! text) {
                return;
            }
            var x = rect.x;
            var y = rect.y;
            var textPosition = style.textPosition;
            var distance = style.textDistance;
            var align = style.textAlign;
            var font = style.textFont;
            var baseline = style.textBaseline;

            textRect = textRect || textContain.getRect(text, font, align, baseline);

            var height = rect.height;
            var width = rect.width;

            var textWidth = textRect.width;
            var textHeight = textRect.height;

            var halfWidth = width / 2 - textWidth / 2;
            var halfHeight = height / 2 - textHeight / 2;
            // Text position represented by coord
            if (textPosition instanceof Array) {
                x = textPosition[0];
                y = textPosition[1];

                ctx.textAlign = align;
                ctx.textBaseline = baseline;
            }
            else {
                switch (style.textPosition) {
                    case 'inside':
                        x += halfWidth;
                        y += halfHeight;
                        break;
                    case 'left':
                        x -= distance + textWidth;
                        y += halfHeight;
                        break;
                    case 'right':
                        x += width + distance;
                        y += halfHeight;
                        break;
                    case 'top':
                        x += halfWidth;
                        y -= distance - textHeight;
                        break;
                    case 'bottom':
                        x += halfWidth;
                        y += height + distance;
                        break;
                }
                // Draw text
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';
            }

            ctx.fillStyle = style.textColor || style.color;
            ctx.font = font;

            var textLines = text.split('\n');
            for (var i = 0; i < textLines.length; i++) {
                ctx.fillText(textLines[i], x, y);
                y += textRect.lineHeight;
            }
        }
    };

    return RectText;
});