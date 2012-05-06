(function ($) {
    $.fn.TCBuild = function (options) {
        var settings = $.extend({
            url: 'tc/',
            interval: 10000
        }, options);

        return this.each(
            function () {
                var currentElement = $(this);
                checkStatus(currentElement);
                setInterval(function () { checkStatus(currentElement); }, settings.interval);
            });

        function checkStatus(currentElement) {

            var buildType = currentElement.attr("data-buildtype");
            $.get(settings.url + 'buildTypes/id:' + buildType + '/builds/',
                function (data) {
                    var xml = $(data).find('build');
                    var maximum = null;

                    xml.each(function () {
                        var value = parseFloat($(this).attr('id'));
                        maximum = (value > maximum) ? value : maximum;
                    });

                    currentElement.attr('data-maxid', maximum);
                    getBuildDetails(currentElement, maximum);
                });
        }



        function getBuildDetails(elem, buildid) {

            $.get(settings.url + '/builds/id:' + buildid + '/',
            function (data) {
                var xml = $(data).find('build');
                var status = xml.attr('status').toLowerCase();

                var statusimage = elem.find('img[name=statusimage]');
                if (statusimage.length == 0) {
                    elem.append('<img name="statusimage" src="' + status + '.png" />');
                } else {
                    statusimage.attr("src", status + '.png');
                }

                var buildType = elem.find('div[name=buildType]');
                if (buildType.length == 0) {
                    elem.append('<div name="buildType">' + xml.find('buildType').attr('name') + '</div>');
                } else {
                    buildType.text(xml.find('buildType').attr('name'));
                }

                elem.attr("class", "tc-status" + ' ' + status);

                var statusText = elem.find('div[name=statusText]');
                if (statusText.length == 0) {
                    elem.append('<div name="statusText">' + xml.find('statusText').text() + '</div>');
                } else {
                    statusText.text(xml.find('statusText').text());
                }

            });

        }
    };
}
)(jQuery);

$(document).ready(function () {

    $(".tc-status").TCBuild();
    
    
});




