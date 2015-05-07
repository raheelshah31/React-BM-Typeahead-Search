/* Search
==================================== */
// Search Main
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var SearchArea = React.createClass({

    // Gets initial state, duh
    getInitialState: function() {
        return {
            data: {
                items: []
            }
        };
    },

    componentDidMount: function(url, _this, data) {

        $('#search').focus();



    },

    getResults: function(e) {

        var _this = this;

        var date = new Date();
        var q = $('#search').val();
        var api_url = this.props.api_url;

        switch (e.which) {

            case 38: // up
                var currentId = $('#search-results .result.active').attr('data-id');
                var prevId = parseInt(currentId, 10) - 1;
                $('#search-results .result').removeClass('active');
                if (!$('#search-results #result-' + prevId).length) return false;
                $('#search-results #result-' + prevId).addClass('active');
                break;

            case 40: // down
                if (!$('#search-results .result.active').length) {

                    $('#search-results .result').first().addClass('active');

                } else {

                    var currentId = $('#search-results .result.active').attr('data-id');
                    var nextId = parseInt(currentId, 10) + 1;
                    if (!$('#search-results #result-' + nextId).length) return false;
                    $('#search-results .result').removeClass('active');
                    $('#search-results #result-' + nextId).addClass('active');

                }
                break;

            case 13: // enter
                var link = $('#search-results .result.active').attr('href');
                window.open(link);
                break;

            default:

                var q = $('#search').val();
                var url = api_url + '?q=' + q + '&time=' + date.getTime(); // for yo cache

                $.getJSON(url, function(data) {

                    var items = data.items; //This can be a complex Object can have timings unique Cinema Keys,Rates etc 
                    var newItems = [];
                    var q = $('#search').val();
                    var qTemp = $('#search').val();
                    q = q.split(" ") //if user types two or more keywords
                        // Do your searching here
                    q.forEach(function(q, a) { //itreate and refine search results for each keyword hit
                        if (q != "") { //No need to iterate if keyword is blank
                            items.forEach(function(item, i) {
                                var qLower = q.toLowerCase();
                                var titleLower = item.eventName.toLowerCase();
                                console.log(item.eventName);
                                var cinemas = item.cinemas;
                                var formattedTitle = highlight(item.eventName, q);
                                // var formattedContent = highlight(item.content, q);
                                var cinema;
                                var hitFlag = false;
                                var newHlCinemaArray = []; //Store Cinema hits highligted

                                // item.formattedContent = formattedContent;
                                item.eventName = formattedTitle;

                                cinemas.forEach(function(item, i) {
                                    console.log(item + " ---" + i);
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

                                console.log("Naya" + item);
                                // Add custom search criteria here
                                if (titleLower.indexOf(qLower) !== -1 || hitFlag) {
                                    newItems.push(item);
                                }




                            });
                        }
                    });

                    console.log(newItems.length)
                    if (!newItems.length && qTemp == "") { //If user input is blank show all the movies

                        newItems = items;
                    } else if (qTemp != "") {

                    }
                    jQuery.unique(newItems);
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
            <div className="row">
            
     <div className="col-lg-12 " >
      <input id="search"  className="form-control" onfocus={this.getResults}   onKeyDown={this.getResults}  type="text" placeholder={this.props.placeholder} />
        <SearchList items={this.state.data.items} />
   
    </div>
    
    </div>


        );
    }
});

// List Component
var SearchList = React.createClass({

    render: function() {

        var rows;
        var items = this.props.items;

        if (items) {

            rows = items.map(function(item, i) {

                return (
                    <ListItem item={item} id={i}/>
                );

            }.bind(this));

        }

        return (
            <ul id="search-results" >
          {rows}
        </ul>
        );

    }

});

// List Item
var ListItem = React.createClass({

    render: function() {

        var item = this.props.item;
        var id = this.props.id;

        return (

            <div class="row" key={item}>
        <div className="col-md-4">
          <div className="thumbnail">
            <img className="movImg" src={item.img}  alt="..."></img>
              <div className="caption">
                <h3 dangerouslySetInnerHTML={{__html: item.eventName}}></h3>
                <TagCinema items={item.cinemas}/>
              </div>
            </div>
          </div>
       </div>

        );
        return (
            <ReactCSSTransitionGroup transitionName="example">
               {item}
                </ReactCSSTransitionGroup>

        )
    }
});

React.render(<SearchArea api_url="api/data.json" placeholder="Search movies/cinema"  />, document.getElementById('search-area'));


var TagCinema = React.createClass({
    componentDidMount: function(url, _this, data) {

    },
    render: function() {
        return (
            <div>
        {this.props.items.map(function(answer, i) {
          return (
             <button   className="btn btn-default btn-sm"  bsStyle='info' dangerouslySetInnerHTML={{__html: answer}}    onmouseover="toggelBuy()"></button>
          );
        }, this)}
      </div>
        );
    }
})

function preg_quote(str) {
    return (str + '').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1");
}

function highlight(data, search) {
    return data.replace(new RegExp("(" + preg_quote(search) + ")", 'gi'), "<b>$1</b>");
}
