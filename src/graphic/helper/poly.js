define(function (require) {

    var smoothSpline = require('./smoothSpline');
    var smoothBezier = require('./smoothBezier');

    return {
        buildPath: function (ctx, style, closePath) {
            var points = style.points;
            var smooth = style.smooth;
            if (points && points.length > 2) {
                ctx.moveTo(points[0], points[1]);
                if (smooth && smooth !== 'spline') {
                    var controlPoints = smoothBezier(
                        points, smooth, closePath, style.smoothConstraint
                    );

                    ctx.moveTo(points[0][0], points[0][1]);
                    var len = points.length;
                    if (! closePath) {
                        len--;
                    }
                    for (var i = 0; i < len; i++) {
                        var cp1 = controlPoints[i * 2];
                        var cp2 = controlPoints[i * 2 + 1];
                        var p = points[(i + 1) % len];
                        ctx.bezierCurveTo(
                            cp1[0], cp1[1], cp2[0], cp2[1], p[0], p[1]
                        );
                    }
                }
                else {
                    if (smooth === 'spline') {
                        points = smoothSpline(points, closePath);
                    }

                    ctx.moveTo(points[0][0], points[0][1]);
                    for (var i = 1, l = points.length; i < l; i++) {
                        ctx.lineTo(points[i][0], points[i][1]);
                    }
                }

                closePath && ctx.closePath();
            }
        }
    }
});