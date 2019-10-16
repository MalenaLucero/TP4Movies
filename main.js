const apiKey = 'e007dc23f3b14243908e46acf9ee53a1'
const fourArray = [...Array(4).keys()]
const twentyArray = [...Array(20).keys()]
let lastRequest
const moviesListId = ['popularMovies', 'topRates', 'upcoming', 'nowPlaying']
const sectionsId = ['popularSection', 'topRatesSection', 'upcomingSection', 'nowPlayingSection']
const loadMoreBtnId = ['popularLoad', 'topRatesLoad', 'upcomingLoad', 'nowPlayingLoad']
const viewAllBtnId = ['popularViewAll', 'topRatesViewAll', 'upcomingViewAll', 'nowPlayingViewAll']
const resultsId = ['popularResults', 'top_ratedResults', 'upcomingResults', 'now_playingResults']


const initialize = () =>{
    fetchMoviePosters('popularMovies', 'popular', fourArray, 1)
    fetchMoviePosters('topRates', 'top_rated', fourArray, 1)
    fetchMoviePosters('upcoming', 'upcoming', fourArray, 1)
    fetchMoviePosters('nowPlaying', 'now_playing', fourArray, 1)
    showElement('h1banner')
    if(window.innerWidth <= 700) {
        hideElement('featureNav')
        showElement('dropDownIcon')
    }
    if(window.innerWidth > 700){
        showElement('featureNav')
        hideElement('dropDownIcon')
    }
    window.addEventListener('resize', function(){
        if(window.innerWidth <= 700) {
            hideElement('featureNav')
            showElement('dropDownIcon')
        }else if(window.innerWidth > 700){
            showElement('featureNav')
            hideElement('dropDownIcon')
        }
    })
}

const homeOnclick = () =>{
    showElement('h1banner')
    moviesListId.forEach(list => innerHTMLCleaner(list))
    loadMoreBtnId.forEach(btn => hideElement(btn))
    sectionsId.forEach(section => showElement(section))
    hideElement('searchSection')
    resultsId.forEach(result => hideElement(result))
    viewAllBtnId.forEach(viewAll => showElement(viewAll))
    initialize()
}

const fetchMoviePosters = (containerId, category, numbersArray, page) =>{
    let container = document.getElementById(containerId)
    fetch(`https://api.themoviedb.org/3/movie/${category}?api_key=${apiKey}&page=${page}`)
        .then(res=>res.json())
        .then(res=>{
            if(numbersArray.length === 20){
                let results = document.getElementById(`${category}Results`)
                results.innerText = `${res.total_results} results`
            }
            numbersArray.forEach(num=>{
                let li = document.createElement('li')
                let anchor = document.createElement('a')
                anchor.id = res.results[num].id
                anchor.classList.add("movieAnchor")
                anchor.href="#"
                anchor.onclick = () => openModal(anchor.id)
                let figure = document.createElement('figure')
                let image = document.createElement('img')
                let movieTitle = document.createElement('figcaption')
                image.src = `https://image.tmdb.org/t/p/w300${res.results[num].poster_path}`
                movieTitle.innerText = res.results[num].title
                figure.appendChild(image)
                figure.appendChild(movieTitle)
                anchor.appendChild(figure)
                li.appendChild(anchor)
                container.appendChild(li)
            })
        })
        .catch(error=>console.log(error))  
}

const openModal = (id) =>{
    event.preventDefault()
    showMovieInfo()
    fillModal(id)
}

const allPopularMovies = () =>{
    event.preventDefault()
    if(window.innerWidth <= 700) addHideClass('featureNav')
    innerHTMLCleaner('popularMovies')
    showElement('popularSection')
    hideElement('topRatesSection')
    hideElement('upcomingSection')
    hideElement('nowPlayingSection')
    hideElement('searchSection')
    hideElement('h1banner')
    fetchMoviePosters('popularMovies', 'popular', twentyArray)
    hideElement('popularViewAll')
    showElement('popularResults')
    showElement('popularLoad')
    clicksCounter('popularLoad', 'popularMovies', 'popular')
}

const allTopRates = () =>{
    event.preventDefault()
    if(window.innerWidth <= 700) addHideClass('featureNav')
    innerHTMLCleaner('topRates')
    hideElement('popularSection')
    showElement('topRatesSection')
    hideElement('upcomingSection')
    hideElement('nowPlayingSection')
    hideElement('searchSection')
    hideElement('h1banner')
    fetchMoviePosters('topRates', 'top_rated', twentyArray)
    hideElement('topRatesViewAll')
    showElement('top_ratedResults')
    showElement('topRatesLoad')
    clicksCounter('topRatesLoad', 'topRates', 'top_rated')
}

const allUpcoming = () =>{
    event.preventDefault()
    if(window.innerWidth <= 700) addHideClass('featureNav')
    innerHTMLCleaner('upcoming')
    hideElement('popularSection')
    hideElement('topRatesSection')
    showElement('upcomingSection')
    hideElement('nowPlayingSection')
    hideElement('searchSection')
    hideElement('h1banner')
    fetchMoviePosters('upcoming', 'upcoming', twentyArray)
    hideElement('upcomingViewAll')
    showElement('upcomingResults')
    showElement('upcomingLoad')
    clicksCounter('upcomingLoad', 'upcoming', 'upcoming')
}

const allNowPlaying = () =>{
    event.preventDefault()
    if(window.innerWidth <= 700) addHideClass('featureNav')
    innerHTMLCleaner('nowPlaying')
    hideElement('popularSection')
    hideElement('topRatesSection')
    hideElement('upcomingSection')
    showElement('nowPlayingSection')
    hideElement('searchSection')
    hideElement('h1banner')
    fetchMoviePosters('nowPlaying', 'now_playing', twentyArray)
    hideElement('nowPlayingViewAll')
    showElement('now_playingResults')
    showElement('nowPlayingLoad')
    clicksCounter('nowPlayingLoad', 'nowPlaying', 'now_playing')
}

const searchMovie = () =>{
    hideElement('popularSection')
    hideElement('topRatesSection')
    hideElement('upcomingSection')
    hideElement('nowPlayingSection')
    showElement('searchSection')
    hideElement('h1banner')
    innerHTMLCleaner('search')
    showElement('searchLoad')
    let input = document.getElementById('searchInput')
    let searchInput = input.value
    if(searchInput !== ''){
        searchFetch('search', `?api_key=${apiKey}&query=${searchInput}&page=1`)
        searchClicksCounter('searchLoad', 'search', searchInput)
    }
}

const closeMovie = () =>{
    event.preventDefault()
    hideElement('movieModal')
    innerHTMLCleaner("title")
    innerHTMLCleaner("subtitle")
    innerHTMLCleaner("backgroundImage")
    innerHTMLCleaner("frontImage")
    innerHTMLCleaner("summary")
    innerHTMLCleaner("genre")
    innerHTMLCleaner("releaseDate")
}

const showMovieInfo = () =>{
    showElement('movieModal')
}

const searchMovieOnclick = () =>{
    searchMovie()
}

const searchFetch = (containerId, apiString) =>{
    let container = document.getElementById(containerId)
    fetch(`https://api.themoviedb.org/3/search/movie${apiString}`)
            .then(res=>res.json())
            .then(res=>{
                if(res.results.length < 20){
                    hideElement('searchLoad')
                }else{
                    showElement('searchLoad')
                }
                let results = document.getElementById('searchResults')
                results.innerText = `${res.total_results} results`
                twentyArray.forEach(num=>{
                    let li = document.createElement('li')
                    let anchor = document.createElement('a')
                    anchor.id = res.results[num].id
                    anchor.classList.add("movieAnchor")
                    anchor.onclick = function(){
                        showMovieInfo()
                        fillModal(anchor.id)
                    }
                    let figure = document.createElement('figure')
                    let image = document.createElement('img')
                    let movieTitle = document.createElement('figcaption')
                    image.src = `https://image.tmdb.org/t/p/w300${res.results[num].poster_path}`
                    movieTitle.innerText = res.results[num].original_title
                    figure.appendChild(image)
                    figure.appendChild(movieTitle)
                    anchor.appendChild(figure)
                    li.appendChild(anchor)
                    container.appendChild(li)
                })
                
            })
    .catch(error=>console.log(error))  
}

const searchClicksCounter = (buttonId, containerId, searchInput) =>{
    let loadMore = document.getElementById(buttonId)
    let counter = 1
    loadMore.onclick = function(){
        event.preventDefault()
        counter += 1
        searchFetch(containerId, `?api_key=${apiKey}&query=${searchInput}&page=${counter}`)
    }
}

const clicksCounter = (buttonId, containerId, category) =>{
    let loadMore = document.getElementById(buttonId)
    let counter = 1
    loadMore.onclick = function(){
        event.preventDefault()
        counter += 1
        fetchMoviePosters(containerId, category, twentyArray, counter)
    }
}

const dropdownMenu = () =>{
    toggleMenu()
}

const toggleMenu = () =>{
    let menu = document.getElementById('featureNav')
    menu.classList.toggle('hide')
}

const showElement = (elementId) =>{
    let element = document.getElementById(elementId)
    element.classList.replace('hide', 'show')
}

const hideElement = (elementId) =>{
    let element = document.getElementById(elementId)
    element.classList.replace('show', 'hide')
}

const addHideClass = (elementId) =>{
    let element = document.getElementById(elementId)
    element.classList.add('hide')
}

const innerHTMLCleaner = (containerId) =>{
    let container = document.getElementById(containerId)
    container.innerHTML = ''
}

//Funcion que hizo Mike del search autocomplete
const handleSearch = () =>{
    let query = event.target.value
    if (query.length >= 2 || (event.keyCode === 13 && query !== lastRequest)) {
		lastRequest = query;
		fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`)
			.then((res) => res.json())
			.then((res) => {
                searchMovie()
            })
    }
}

// FUNCION PARA LLENAR EL MODAL
const fillModal = peliculaId =>{
fetch(`https://api.themoviedb.org/3/movie/${peliculaId}?api_key=${apiKey}`)
    .then(res=>res.json())
    .then(res=> {
    let {title, tagline, poster_path, backdrop_path, overview, release_date, genres} = res
    
    printTitle(title)
    printTagLine(tagline)
    printPosterPath(poster_path)
    printBackDropPath(backdrop_path)
    printOverview(overview) 
    prinReleaseDate(release_date)
    printGenre(genres)
})
    .catch(error=>console.log(error))
}

const printTitle = title =>{
    let modalTitle = document.getElementById('title')
    modalTitle.innerText = title
}

const printTagLine = tagline =>{
    let modalTagline = document.getElementById('subtitle')
    modalTagline.innerText = tagline
}

const printOverview = overview =>{
    let summary = document.getElementById('summary')
    summary.innerText = overview
}

const prinReleaseDate = release_date =>{
    let releaseDate = document.getElementById('releaseDate')
    releaseDate.innerText = `${release_date.slice(8,10)}- ${release_date.slice(5,7)}- ${release_date.slice(0,4)}`
    } 

const printGenre = genres => {
    let modalGenre = document.getElementById('genre')
    modalGenre.innerHTML= ""
    genres.forEach((e, index)=>{
        let gen = document.createElement('span')
        gen.innerText = index === genres.length - 1 ? `${e.name}` : `${e.name}, `
        modalGenre.appendChild(gen)
    })      
}
    
const printPosterPath = poster_path =>{
    let frontImage = document.getElementById("frontImage")
    frontImage.src = `https://image.tmdb.org/t/p/w300${poster_path}`
} 

const printBackDropPath = backdrop_path =>{
    let image = document.getElementById('backgroundImage')
    image.src = `https://image.tmdb.org/t/p/w500${backdrop_path}`
    
} 

const movieBoxOnClick = () =>{ hideElement('movieModal')}
