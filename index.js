/* global define */
(function (root, factory) {
    /* istanbul ignore next */
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.compareVersions = factory();
    }
}(this, function () {

    var patch = /-([0-9A-Za-z-.]+)/;

    function split(v) {
        var temp = v.split('.');
        var arr = temp.splice(0, 2);
        arr.push(temp.join('.'));
        return arr;
    }

    function tryParse(v) {
        return isNaN(Number(v)) ? v : Number(v);
    }

    function betterIsNaN(v) {
        return v != v;
    }

    return function compareVersions(v1, v2) {
        var s1 = split(v1);
        var s2 = split(v2);

        for (var i = 0; i < 3; i++) {
            var n1 = parseInt(s1[i] || 0, 10);
            var n2 = parseInt(s2[i] || 0, 10);
            var s1i = s1[i];
            var s2i = s2[i];

            // if we can't parse it as a number, fall back to string > and <
            if (betterIsNaN(n1) || betterIsNaN(n2)) {
                if (s1i === 'x' || s2i === 'x') {
                    return 0;
                }

                if (s1[i] > s2[i]) return 1;
                if (s2[i] > s1[i]) return -1;
                return 0;
            }

            if (n1 > n2) return 1;
            if (n2 > n1) return -1;
        }
        if ([s1[2], s2[2]].every(patch.test.bind(patch))) {
            var p1 = patch.exec(s1[2])[1].split('.').map(tryParse);
            var p2 = patch.exec(s2[2])[1].split('.').map(tryParse);

            for (i = 0; i < Math.max(p1.length, p2.length); i++) {
                if (p1[i] === undefined || typeof p2[i] === 'string' && typeof p1[i] === 'number') return -1;
                if (p2[i] === undefined || typeof p1[i] === 'string' && typeof p2[i] === 'number') return 1;

                if (p1[i] > p2[i]) return 1;
                if (p2[i] > p1[i]) return -1;
            }
        } else if ([s1[2], s2[2]].some(patch.test.bind(patch))) {
            return patch.test(s1[2]) ? -1 : 1;
        }

        return 0;
    };

}));
