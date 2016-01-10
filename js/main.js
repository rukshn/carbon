const DOMAIN = 'https://trylime.com'
const API = 'https://trylime.com/api/v2/'

$.get('../html/templates/home.html').done(function(data){
	var home_template = data

	var App = new Ractive({
		template: home_template,
		el: "#canvas",
		data:{
			podcast_data : false,
			podcast_stations: null,
			podcast_playlist: null,
			podcast_station_title: null,
			loading: true,
			podcast_playlist_rady: false,
			station_details: null,
			now_playing_media: null,
			playing_index: null,
		}
	})

	if (App.get('podcast_stations') === null) {
		$.get(API + 'podcast_home').done(function(data){
			App.set('podcast_data', true)
			App.set('podcast_stations', data)
			App.set('loading', false)
		})
	}

	App.on('play-podcast', function(event){
		var index = event.node.getAttribute( 'data-index' )
		if (App.get('station_details') != null) {
			var current_playing_station = App.get('station_details')
		}
		var icon = current_playing_station['image']
		var title = current_playing_station['title']

		var playing_podcast = App.get('podcast_playlist')
		playing_podcast = playing_podcast[index]

		var podcast_link = playing_podcast.podlink
		var podcast_name = playing_podcast.title

		notifyMe(title, icon, podcast_name)

		App.set('playing_index', index)
		App.set('now_playing_media', podcast_link)
		var player = document.getElementById('now_playing')
		player.play()

		// if(player.onProgress){
		// 	var start_time = player.seekable.start(0);  // Returns the starting time (in seconds)
		// 	var end_time = player.seekable.end(0);    // Returns the ending time (in seconds)
		// 	// player.currentTime = 122; // Seek to 122 seconds
		// 	var played_time = player.played.end(0);      // Returns the number of seconds the browser has played

		// 	console.log(end_time)
		// 	console.log(start_time)
		// 	console.log(played_time)	
		// }
		
	})

	App.on('time_update', function(event){
		var playing_index = App.get('playing_index')
		var player = document.getElementById('now_playing')
		var total_time = player.duration
		var played_time = player.played.end(0)

		var parent_container = document.getElementById('playlist-item-parent')

		var playlist_items = parent_container.getElementsByClassName('item-sm');
		var playlist_item = playlist_items[playing_index]		
		var played_precentage = (played_time/total_time)*100

		played_precentage = played_precentage.toFixed(2)
		var remaining_precentage = 100 - played_precentage
	 	var background_color =  'linear-gradient(90deg, rgba(37, 211, 102, 0.5) ' + played_precentage + '%, #fff ' + played_precentage +'%)'
		playlist_item.style.border-top = '1px solid rgba(37, 211, 102, 0.5)'
		playlist_item.style.border-bottom = '1px solid rgba(37, 211, 102, 0.5)'

		playlist_item.style.background = background_color

	})	

	App.on('get-pods', function(event){
		var index = event.node.getAttribute( 'data-index' )
		App.set('loading', true)
		App.set('podcast_data', false)
		if (App.get('podcast_stations') != null) {
			var pod_stations = App.get('podcast_stations')
			var clicked_podcast = pod_stations[index].url
			$.get(API + 'feed', {feed: clicked_podcast}).done(function(data){
				var podcast_trim = data.podcasts.slice(0,10)
				console.log(podcast_trim)
				App.set('podcast_playlist', podcast_trim)
				App.set('loading', false)
				App.set('podcast_playlist_ready', true)
				var station_details= new Array()
				station_details['title'] = data.title
				if (data.description.length > 150) {
					station_details['description'] = data.description.substring(0,149) + "..."
				}
				else
				{
					station_details['description'] = data.description
				}
				station_details['image'] = data.image 
				App.set('station_details', station_details)
			})
		}
	})

	function notifyMe(title,icon,message) {
		var icon = icon
		var message = message
		var title = title
		if (!Notification) {
	    	console.log('notification not enabled')
	    	return
	  	}

	  if (Notification.permission !== "granted")
	    Notification.requestPermission()
	  else {
	    var notification = new Notification(title, {
	      icon: icon,
	      body: message,
	    })
		setTimeout(notification.close.bind(notification), 4000)

	    // notification.onclick = function () {
	    
	    // }
	  }
	}
})
