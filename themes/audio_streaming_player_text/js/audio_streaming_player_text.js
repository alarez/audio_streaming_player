(function($) {
    'use strict';
    Drupal.behaviors.audiostreamingplayer = {
        attach: function(context, settings) {
            var pause_ = true;
            var startmessage = Drupal.t('Click Play to start listening');
            $("#responsecontainer").html(startmessage);
            var stream = {
                //Atributtes: title and stream url
                title: startmessage,
                mp3: Drupal.settings.audiostreamingplayer.stream_url
            },
            ready = false;

            $("#audio_streaming_player").jPlayer({
                ready: function(event) {
                    ready = true;
                    //If the variable auto-play is on, then starts playing from the beginning
                    if (Drupal.settings.audiostreamingplayer.auto_play === 1) {
                        $(this).jPlayer("setMedia", stream).jPlayer("play");
                        pause_ = false;
                    }

                },
                pause: function() {
                    //Pause audio playback
                    $(this).jPlayer("clearMedia");
                    pause_ = true;
                },
                error: function(event) {
                    if (ready && event.jPlayer.error.type === $.jPlayer.error.URL_NOT_SET) {
                        pause_ = false;
                        // Setup the media stream again and play it.
                        $(this).jPlayer("setMedia", stream).jPlayer("play");

                    }
                },
                solution: 'flash, html',
                //swf path
                swfPath: Drupal.settings.audiostreamingplayer.swf,
                //Allowed Formats
                supplied: "mp3,oga",
                preload: "none",
                wmode: "window",
                keyEnabled: true
            });
            //Get the metadata from the stream

            var refreshId = setInterval(function() {

                if (!pause_) {
                    var parameters = {
                        "stream_url": Drupal.settings.audiostreamingplayer.stream_url
                    };
                    //ajax call to get the metadata
                    $.ajax({
                        data: parameters,
                        url: '/sites/all/modules/audio_streaming_player/NowPlaying/as_getnowplaying.php',
                        type: 'post',
                        beforeSend: function() {

                        },
                        success: function(response) {
                            //Load the result in the container
                            $("#responsecontainer").html(response);
                        }
                    });

                }
                else {
                    $("#responsecontainer").html(startmessage);
                }
            }, 6000);
        }

    };
}(jQuery));
