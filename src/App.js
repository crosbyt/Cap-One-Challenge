import React, { Component } from 'react';
import './App.css';
import SearchDisplay from './SearchDisplay.js';
import axios from 'axios';
import ls from 'local-storage'
import { Input, InputNumber,  Button, Col, Card, Modal, Layout, Collapse, DatePicker, Row, Checkbox, Menu, Icon, List, Select} from 'antd';
import 'antd/dist/antd.css';
const { Header, Content} = Layout;
const { Meta } = Card;
const Search = Input.Search;
const Input = Input.Group;
const Panel = Collapse.Panel;
const CheckGroup = Checkbox.Group;
const op = Select.Option;

//Different Building centers used for API
const options = [
	{ label: 'All', value: '' },
	{ label: 'Headquarters', value: 'HQ' },
	{ label: 'Langley Research Center (LARC)', value: 'LARC' },
	{ label: 'Jet Propulsion Laboratory (JPL)', value: 'JPL' },
	{ label: 'Kennedy Space Center (KSC)', value: 'KSC' },
	{ label: 'Armstrong Flight Research Center (ARFC)', value: 'ARFC' },
	{ label: 'Ames Research Center (ARC)', value: 'ARC' },
	{ label: 'Goddard Space Flight Center (GSFC)', value: 'GSFC' },
	{ label: 'Marshall Space Flight Center (MSFC)', value: 'MSFC' },
	{ label: 'Glenn Research Center (GRC)', value: 'GRC'},
	{ label: 'John C. Stennis Space Center (SSC)', value: 'SSC' },
];
const sortOps = ["Alphabetical", "newest First", "Oldest First"]

class App extends Component {
	state = {
		searchData: "",
		search: "",
		spot: "",
		seen: false,
		currentPic: 0,
		currentFavorite: 0,
		checkedBuildings: [],
	}
// show image data
showData = (index) => {
	if(this.state.current == "favorite"){
		this.setState({
			seen: true,
			currentFavorite: index
		});
	}
	else{
		this.setState({
			seen: true,
			currentPic: index
			});
		}
	}
//store user input
userInput = e => {
	ls.set(e.target.id, e.target.value)
	};
//Modal button
handleYes = (e) => {
	this.setState({
		seen: false,
		});
	}
handleNo = (e) => {
	this.setState({
		seen: false,
		});
	}
//storing what centers have been chosen by the user
centerStore = checkedValues => {
	this.setState({
		checked	Buildings: checkedValues
		})
	}

//function for list of search history, searches for what is selected (BONUS FUNCTION)
searchHistory = item => {
	ls.set("search", item)
	this.search()
	}
//which center to search
searchCenter = center => {
	ls.set("center", center)
	}

// select menu
menuSelect = (e) => {
	this.setState({
		current: e.key,
		});
	}
	
// search function that requests from NASA API
search = e => {
	var searchWord = ""
	searchWord = "https://images-api.nasa.gov/search?q=" + ls.get("search") + "&media_type=image&year-start=" + ls.get("startYear") + "&year_end=" + ls.get("endYear") + "&center=" + ls.get("center")
	axios.get(searchWord);
	.catch((error) => {
		console.log("Bad Request")
		})
	.then((res => {
		let data = res.data;
		this.setState({searchData: data.collection})
		}))
	//adds to search history (BONUS FEATURE)
	var updatedHistory = ls.get("updatedHistory")
	updatedHistory = JSON.parse(updatedHistory)
	updatedHistory.push(ls.get("search"))
	ls.set("updatedHistory", JSON.stringify(updatedHistory))
	ls.set("startYear", "1920")
	ls.set("endYear", "2019")
	ls.set("center", "")
	}

//clear
searchClear = e => {
	var arr = []
	ls.set("updatedHistory", JSON.stringify(arr))
	this.setState({})
	}
	
//add to favorite (BONUS FEATURE WILL ADD LATER)


componentLoad() {
      var arr = []
      if(!ls.get("endYear")){
        ls.set("startYear", "1920")
      }
      if(!ls.get("endYear")){
        ls.set("endYear", "2019")
      }
      if(ls.get("center") == "null" || !ls.get("center")){
        ls.set("center", "")
      }
      if(ls.get("updatedHistory") == "null"|| !ls.get("updatedHistory")){
        ls.set("updatedHistory", JSON.stringify(arr))
      }
      if(ls.get("favorites") == "null" || !ls.get("favorites")){
        ls.set("favorites", JSON.stringify(arr))
      }
      if(!ls.get("search")){
        ls.set("search", "")
      }
      if(!ls.get("location")){
        ls.set("location", "")
      }
      this.setState({

      })
      axios.get("https://images-api.nasa.gov/search?q=" + ls.get("search") + "&media_type=image")
      .catch((error) =>{
        console.log("Bad Request")
      })
      .then((res => {
      let data = res.data;
      this.setState(
        {
          searchData: data.collection,
        })
      }))
   }
	
render() {
	
	
	}


}




export default App;
