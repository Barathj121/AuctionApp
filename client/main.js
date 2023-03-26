/* 
  * Fires an API call to the server and adds the reported city as an alien city
  */
function postAlienEncounter() {
    var team = $("#Team-post-input").val();
    var player = $("#Player-post-input").val();
    var amount = $("#bidamount-post-input").val();

    // Fires an Ajax call to the URL defined in the index.js function file
// All URLs to the Advanced I/O function will be of the pattern: /server/{function_name}/{url_path}
    $.ajax({
        url: "/server/alien_city_function/alien", //If your Advanced I/O function is coded in the Java environment, replace the "alien_city_function" with "AlienCityAIO"
        type: "post",
        contentType: "application/json",
        data: JSON.stringify({
            "amount": amount,
            "player_name": player,
            "city_name": team
        }),
        success: function (data) {
            alert(data.message);
        },
        error: function (error) {
            alert(error.message);
        }
    });
}

/**
 * Fires an API call to the server to check whether the given dohni is alien city or not
 */
function getAlienEncounter() {
    showLoader();
    var positive = "https://media.giphy.com/media/Y1GYiLui9NHcxVKhdo/giphy.gif";
    var negative = "https://media.giphy.com/media/fsPcMdeXPxSP6zKxCA/giphy.gif";
    var city = document.getElementById("playerview").value;

  // Fires an Ajax call to the URL defined in the index.js function file
 // All URLs to the function will be of the pattern: /server/{function_name}/{url_path}
    $.ajax({
        url: "/server/alien_city_function/alien?player_name=" + city, //If your Advanced I/O function is coded in the Java environment, replace the "alien_city_function" with "AlienCityAIO"
        type: "get",
        success: function (dataa) {
            console.log(dataa);
            let data = JSON.parse(dataa);
            let playername = data[0].Auction.Player ;
	let team = data[0].Auction.Team;
    let amt=data[0].Auction.Auction_Amt;
            document.getElementById("result").innerHTML = "Player name selected is : "+playername+ "<br>bidding team is : "+team+"<br>highest bid is : " +amt;
            // $("#result-text").text("");
            // $("#result-text").text(data.message);
            // var imagesrc = negative;
            // if (data.signal == 'positive') {
            //     imagesrc = positive;
            // }
            // $("#result-image").html("");
            // $("#result-image").html("<p>hi it worked<p/>");
            // hideLoader();
        },
        errror: function (error) {
            alert(error.message);
        }
    });
}

function showLoader()
{
    $("#result-container").hide();
    $("#loader").show();
}

function hideLoader()
{
    $("#loader").hide();
    $("#result-container").show();
}