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

		}
	})

	if (App.get('podcast_stations') === null) {
		$.get(API + 'podcast_home').done(function(data){
			App.set('podcast_data', true)
			App.set('podcast_stations', data)
			App.set('loading', false)
		})
	}

	App.on('get-pods', function(event){
		var index = event.node.getAttribute( 'data-index' )
		App.set('loading', true)
		App.set('podcast_data', false)
		if (App.get('podcast_stations') != null) {
			var pod_stations = App.get('podcast_stations')
			var clicked_podcast = pod_stations[index].url
			$.get(API + 'feed', {feed: clicked_podcast}).done(function(data){
				var podcast_trim = data.podcasts.slice(0,10);
				App.set('podcast_playlist', podcast_trim)
				App.set('loading', false)
				App.set('podcast_playlist_ready', true)
				var station_details= new Array()
				station_details['title'] = data.title
				station_details['description'] = data.description
				station_details['image'] = data.image 
				App.set('station_details', station_details)
			})
		}
	})

})