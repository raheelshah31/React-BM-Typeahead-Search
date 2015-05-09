/* Search Now Showing Shows
==================================== */
//Makes things fancy adds Animation
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

// Search Main Responsible for the search logic and unique cinema and eventname tagging
var SearchArea = React.createClass({

    // Gets initial state, duh :)
    getInitialState: function() {
        return {
            data: {
                items: []
            }
        };
    },

    componentDidMount: function(url, _this, data) {
        $('#search').focus();
        setTimeout(function() {
            $("#search").trigger('click'); //had to do this for initial load of movies will remove it in the future #Todo
        }, 1);

    },

    getResults: function(e) {

        var _this = this;
        var date = new Date();
        var q = $('#search').val();
        var api_url = this.props.api_url

        switch (e.which) {

            default:

                var q = $('#search').val();
            var url = api_url + '?q=' + q + '&time=' + date.getTime(); // for no cache

            $.getJSON(url, function(data) {

                var items = data.items; //This can be a complex Object can have timings unique Cinema Keys,Rates etc
                var newItems = [];
                var q = $('#search').val();
                var qTemp = $('#search').val();
                q = q.split(" ") //if user types two or more keywords
                    //searching here

                q.forEach(function(q, a) { //itreate and refine search results for each keyword hit

                    if (q != "") { //No need to iterate if keyword is blank
                        items.forEach(function(item, i) {
                            var qLower = q.toLowerCase();
                            var titleLower = item.eventName.toLowerCase();
                            //   console.log(item.eventName);
                            var cinemas = item.cinemas;

                            var formattedTitle = highlight(item.eventName, q);

                            var cinema;
                            var hitFlag = false;
                            var newHlCinemaArray = []; //Store Cinema hits highligted

                            item.eventName = formattedTitle;

                            cinemas.forEach(function(item, i) {
                                //console.log(item + " ---" + i);
                                cinema = item.toLowerCase();
                                if (cinema.indexOf(qLower) != -1) {
                                    hitFlag = true;
                                    newHlCinemaArray.push(highlight(item, q)); //unique hit entries
                                }
                            });
                            if (hitFlag) {
                                item.cinemas = newHlCinemaArray;
                            } else {

                            }



                            // Add custom search criteria here
                            if (titleLower.indexOf(qLower) !== -1 || hitFlag) {
                                newItems.push(item);
                            }




                        });
                    }
                });

                if (!newItems.length && qTemp == "") { //If user input is blank show all the movies
                    newItems = items;
                } else if (qTemp != "") {

                }
                jQuery.unique(newItems); //Removes duplicate entries 
                if (_this.isMounted()) {
                    _this.setState({
                        data: {
                            items: newItems
                        }
                    });
                }

            });

            return; // exit this handler for other keys
        }

    },

    render: function() {

        return (


            <div className="col-lg-12 " >
                    
                <input id="search"  className="form-control"   onClick={this.getResults} onKeyDown={this.getResults}   type="text" placeholder={this.props.placeholder} />
                <SearchList items={this.state.data.items}  />
  
            </div>




        );
    }
});

// List Component responsible to get rows of data which internally is rendered by ListItem
var SearchList = React.createClass({
    componentDidMount: function(url, _this, data) {


    },
    render: function() {

        var rows;
        var count
        var items = this.props.items;
        if (items) {

            rows = items.map(function(item, i) {

                return (
                    <ListItem key={item.eventName} item={item} id={i}/>
                );


            }.bind(this));

        }
        //console.log("------------New---------------"+rows)
        if (rows == '') {
            $(".alert-info").show("slow")
        } else {
            $(".alert-info").hide("slow")
        }
        return (
            <div className="row">
                <ReactCSSTransitionGroup transitionName="example">
                 {rows}
                </ReactCSSTransitionGroup>
            </div>
        );


    }

});

// List Item responsible to render each grid card currently the card is of size 4 in a grid of 12
var ListItem = React.createClass({
    getInitialState: function() {
        return {
            flag: false
        };
    },
    componentDidMount: function(url, _this, data) {
       $('button').tooltip()
    },
    clickHandler: function(e) {


        if (this.state.flag) {

            this.setState({
                flag: false
            });
        } else {

            this.setState({
                flag: true
            });
        }
    },
    render: function() {
        var _this = this;
        var item = this.props.item;
        var id = this.props.id;
        var className;
      //  console.log(this.state.flag)
        if (this.state.flag) {
            className = 'card flipped';

        } else {
            className = 'card'

        }
        return (



            <div className="col-sm-6 col-md-3 col-xs-12 cards">
                <div className="thumbnail">
                     <img className="movImg" src={item.img}  alt="..."></img>
                     <div className="caption">
                      <h3 dangerouslySetInnerHTML={{__html: item.eventName}}></h3>

                        <div className="flip" onClick={this.clickHandler}>
                                <div className={className}> 
                                    <div className="face front"> 
                                        <div className="well well-sm inner cinemas"> 
                                           <TagCinema items={item.cinemas} flag="false" />
                                        </div>
                                    </div> 
                                <div className="face back"> 
                                <div className="well well-sm inner timings"> <TagCinema items={item.timings} flag="true" /></div> 
                                </div>
                             </div>
                        </div>    
                </div>
                </div>
            </div>


        );

    }
});

//React.render(<SearchArea api_url="api/data.json" placeholder="Search for a movie, play, event, sport or more"  />, document.getElementById('search-area'));

//Tag Cinema responsile to show hits of cinema for a particular event / movie.In case of blank search prints all cinema under the movie
var TagCinema = React.createClass({
    componentDidMount: function(url, _this, data) {
       
    },
    render: function() {
        var tooltip;
        if (this.props.flag =="true") {
                     
            tooltip = 'Buy Tickets';
            
        } else {
           
            tooltip = 'Check Timings'

        }
        return (
            <div>
        {this.props.items.map(function(answer, i) {
          return (
             <button   className="btn btn-default btn-sm"  bsStyle='info' dangerouslySetInnerHTML={{__html: answer}}   title={tooltip}></button>
          );
        }, this)}
      </div>
        );
    }
})

//Takes str and puts a backslash in front of every character that is part of the regular expression syntax 
function preg_quote(str) {
    return (str + '').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1");
}

//Higlight the keywords hit in a eventName or cinema
function highlight(data, search) {
    return data.replace(new RegExp("(" + preg_quote(search) + ")", 'gi'), "<b>$1</b>");
}

function unmountDefaultList() {
    //alert("unmount")


}
React.render(<SearchArea api_url="api/data.json" placeholder="Search for a movie, play, event, sport or more"  />, document.getElementById('search-area'))