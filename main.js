const apiKey = 'e007dc23f3b14243908e46acf9ee53a1'
const fourArray = [...Array(4).keys()]
const twentyArray = [...Array(20).keys()]
let lastRequest

//Ids arrays
const moviesListId = ['popularMovies', 'topRates', 'upcoming', 'nowPlaying']
const sectionsId = ['popularSection', 'topRatesSection', 'upcomingSection', 'nowPlayingSection', 'searchSection']

const initialize = () =>{
    menuHandler()
    fetchMoviePosters('popular', 'popular', fourArray, 1)
    fetchMoviePosters('topRates', 'top_rated', fourArray, 1)
    fetchMoviePosters('upcoming', 'upcoming', fourArray, 1)
    fetchMoviePosters('nowPlaying', 'now_playing', fourArray, 1)
    showElement('h1banner')
    window.addEventListener('resize', ()=> menuHandler())
}

//toggles between mobile menu and desktop menu according to screen size
const menuHandler = () =>{
    if(window.innerWidth <= 700) {
        hideElement('featureNav')
        showElement('dropDownIcon')
    }else if(window.innerWidth > 700){
        showElement('featureNav')
        hideElement('dropDownIcon')
    }
}

//return home
const homeOnclick = () =>{
    showElement('h1banner')
    moviesListId.forEach(list => innerHTMLCleaner(list))
    loadMoreBtnId.forEach(btn => hideElement(btn))
    sectionsId.filter(sectionId=>sectionId !== 'searchSection').forEach(section => showElement(section))
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
    hideElement('movieBoxContainer')
    showElement('movieModal')
    showLoader()
    fillModal(id)    
}

//view all and nav items onclick for the four sections
const viewAll = (section, category) =>{
    event.preventDefault()
    if(window.innerWidth <= 700) hideMobileMenu()
    innerHTMLCleaner(`${section}`)
    showElement(`${section}Section`)
    hideSections(sectionsId.filter(sectionId => sectionId !== `${section}Section`))
    hideElement('h1banner')
    fetchMoviePosters(`${section}`, `${category}`, twentyArray)
    hideElement(`${section}ViewAll`)
    showElement(`${category}Results`)
    showElement(`${section}Load`)
    clicksCounter(`${section}Load`, `${section}`, `${category}`)
}

const searchMovie = () =>{
    innerHTMLCleaner('search')
    showElement('searchSection')
    hideSections(sectionsId.filter(sectionId => sectionId !== 'searchSection'))
    hideElement('h1banner')
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
                        event.preventDefault()
                        hideElement('movieBoxContainer')
                        showElement('movieModal')
                        showLoader()
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


//Search autocomplete
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
    hideLoader()
    showElement('movieBoxContainer')
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

const movieBoxOnClick = () => hideElement('movieModal')

//helpers
const showElement = (elementId) =>{
    let element = document.getElementById(elementId)
    element.classList.replace('hide', 'show')
}

const hideElement = (elementId) =>{
    let element = document.getElementById(elementId)
    element.classList.replace('show', 'hide')
}

const innerHTMLCleaner = (containerId) =>{
    let container = document.getElementById(containerId)
    container.innerHTML = ''
}

const hideLoader = () =>{
    let hideLoad = document.getElementById('loader')
    hideLoad.classList.remove('loader')
}

const showLoader = () =>{
    let showLoad = document.getElementById('loader')
    showLoad.classList.add('loader')
}

const toggleMenu = () =>{
    let menu = document.getElementById('featureNav')
    menu.classList.toggle('hide')
}

const hideMobileMenu = () =>{
    let menu = document.getElementById('featureNav')
    menu.classList.add('hide')
}

const hideSections = (arrayOfSectionsId) =>{
    arrayOfSectionsId.forEach(sectionId=>hideElement(sectionId))
}