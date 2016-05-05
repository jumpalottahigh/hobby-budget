//DEV
var firebaseDB = new Firebase("https://boiling-heat-4669.firebaseio.com/hobby-budget/");
//PRODUCTION
// var firebaseDB = new Firebase("https://hobby-budget.firebaseio.com");

var user = firebaseDB.getAuth();

//Authenticate the user
function login(username, pass) {
  firebaseDB.authWithPassword({
    email: username,
    password: pass
  }, function(error, authData) {
    if (error) {
      console.log("Login Failed! " + error);
    } else {
      console.log("Authenticated successfully!");

      user = firebaseDB.getAuth();
      if (user === null) {
        //user not logged in
        $('#loginStatus').removeClass("alert-success").addClass("alert-danger").html("Not logged in!");
      } else {
        //user logged in
        $('#loginStatus').removeClass("alert-danger").addClass("alert-success").html("You are logged in as: " + JSON.stringify(user.password.email));
      }

      location.reload();
    }
  });
}

//Check if the user is logged in
(function loggedIn() {
  user = firebaseDB.getAuth();
  //Check if user is logged in
  if (user === null) {
    //user not logged in
    $('#loginStatus').removeClass("alert-success").addClass("alert-danger").html("Not logged in!");
    $('#btnModalLogin').show();
  } else {
    //user logged in
    $('#loginStatus').removeClass("alert-danger").addClass("alert-success").html("You are logged in as: " + JSON.stringify(user.password.email));
    $('#btnModalLogin').hide();
  }
})();

function validateInput(input) {
  if(input === "") {
    return false;
  } else {
    return true;
  }
}

//Grab initial data from DB and populate UI
firebaseDB.on("value", function (snap) {
  var currentTimestamp = Date.now();

  //First time start up initializers
  //If user has no balance, let's set up the app for first use
  if(snap.val().balance === undefined) {
    //Create a recurring payment at first date
    var startingDate = currentTimestamp;
    var nextDate = moment(startingDate).add(30, 'days').unix() * 1000;

    var initBalance;
    if($('#monthlyAllowance').val() === "") {
      initBalance = 0;
    } else {
      initBalance = parseInt($('#monthlyAllowance').val());
    }
    //Init balance and reccuring date
    firebaseDB.update({
      balance: initBalance,
      startingDate: startingDate,
      nextPaymentDate: nextDate
    });
  }

  //Add balance to the user if a monthy has passed
  if(parseInt(currentTimestamp) > parseInt(snap.val().nextPaymentDate)){
    var updateBalance = parseInt(snap.val().balance);
    var updateNextPaymentDate = snap.val().nextPaymentDate;
    updateNextPaymentDate = moment(updateNextPaymentDate).add(30, 'days').unix() * 1000;
    updateBalance += parseInt(snap.val().monthlyAllowance);
    //Update balance and set next payment time
    firebaseDB.update({
      balance: updateBalance,
      nextPaymentDate: updateNextPaymentDate
    });
  }


  //Get all purchases from FB
  var allPurchases = snap.val().purchases;
  var constructorPurchases = "";
  var constructorTotals = '';
  var totalThisMonth = 0;
  var totalThisYear = 0;

  for (var i in allPurchases) {
    constructorPurchases += "<h2 class='flex-row text-info'>" + i + "</h2><div class='flexbox-container margin-top'>";

    //Collect totals information
    constructorTotals += '<div class="col-xs-4">' + i + "</div>";

    for (var j in allPurchases[i]) {
      //Purchase history
      constructorPurchases += '<div class="box flex-item text-left">';
      constructorPurchases += '<b>Name: ' + allPurchases[i][j].name + '<br>Price: ' + allPurchases[i][j].price + '<br>Date: ' + moment(allPurchases[i][j].timestamp).format("Do MMM YYYY") + '</b>';
      constructorPurchases += '</div>';

      //Check whether to add purchase to current month or current year
      if(moment(currentTimestamp).format("MMM") == moment(allPurchases[i][j].timestamp).format("MMM")) {
        //Purchse was done in the current month
        totalThisMonth += parseFloat(allPurchases[i][j].price);
      }
      if(moment(currentTimestamp).format("YYYY") == moment(allPurchases[i][j].timestamp).format("YYYY")) {
        //Purchase in the current year
        totalThisYear += parseFloat(allPurchases[i][j].price);
      }
    }
    constructorPurchases += "</div>";

    //Fix to 2 decimal places
    constructorTotals += '<div class="col-xs-4 text-success"><strong>' + totalThisMonth.toFixed(2) + '</strong></div><div class="col-xs-4 text-info"><strong>' + totalThisYear.toFixed(2) + '</strong></div>';

    //Reset total counters for next itiration
    totalThisMonth = 0;
    totalThisYear = 0;
  }

  //Update the UI
  $('#totals').html(constructorTotals);
  $('#purchases').html(constructorPurchases);
  $('#monthlyAllowance').val(snap.val().monthlyAllowance);
  $('#currentBalance').html("<b>" + snap.val().balance + "</b>");
  $('#nextPayment').html("<b>" + moment(snap.val().nextPaymentDate).endOf('day').fromNow() + "</b><br>On: <b>" + moment(snap.val().nextPaymentDate).format("Do MMM YYYY") + "</b>");
});


//UI
//
//Login button
$('#btnLogin').click(function () {
  login($('#user').val(), $('#pass').val());
});

//Save settings button
$('#btnSaveSettings').click(function () {
  var allowance = parseInt($('#monthlyAllowance').val());
  firebaseDB.update({
    monthlyAllowance: allowance
  });
});

//Add expense button
$('#btnAddExpense').click(function () {
  var exName = $('#expenseName').val();
  var exPrice = $('#expenseValue').val();
  var exCategory = $('#expenseCategory').val();
  var date = Date.now();

  if(validateInput(exName) && validateInput(exPrice) && validateInput(exCategory)) {
    //Save the purchase to FB
    firebaseDB.child('/purchases/' + exCategory).push({
      name: exName,
      price: exPrice,
      timestamp: date
    });

    //Update the current balance
    var oldBalance = '';
    firebaseDB.once('value', function (snap) {
      oldBalance = snap.val().balance;
    });

    oldBalance -= exPrice;

    firebaseDB.update({
      balance: oldBalance
    });

    //reset the UI
    $('#expenseName').val("");
    $('#expenseValue').val("");
  } else {
    console.log("Input not validated!");
  }
});
