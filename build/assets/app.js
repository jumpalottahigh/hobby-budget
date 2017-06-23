// Initialize Firebase
//Production
var config = {
  apiKey: "AIzaSyDCMODJqnwMKRwS2xI1OVugW-G5PzzNraA",
  authDomain: "hobby-budget.firebaseapp.com",
  databaseURL: "https://hobby-budget.firebaseio.com",
  storageBucket: "hobby-budget.appspot.com",
};

//Create app, DB ref and auth
var app = firebase.initializeApp(config);
var firebaseDB = app.database().ref();
var auth = app.auth();

//Check if the user is logged in
function loggedIn() {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      //singed in
      $('#loginStatus').removeClass("alert-danger").addClass("alert-success").html("You are logged in as: " + JSON.stringify(user.email));
      $('#btnModalLogin').hide();
    } else {
      //signed out
      $('#loginStatus').removeClass("alert-success").addClass("alert-danger").html("Not logged in!");
      $('#btnModalLogin').show();
    }
  });
}

//Check user login status at start up
loggedIn();

//Authenticate the user
function login(username, pass) {
  auth.signInWithEmailAndPassword(username, pass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode + errorMessage);
    // ...
    if (errorCode === 'auth/wrong-password') {
      console.log('Wrong password.');
    } else {
      console.error(error);
    }
    console.log("SUCCESS?");
  });
}

function validateInput(input) {
  if (input === "") {
    return false;
  } else {
    return true;
  }
}

function filterByMonth(mon) {
  //Reset all prev filters
  $('.purchase').show();
  //Create the correct monthly filter
  var monthFilter = mon || Date.now();

  if (!mon) {
    monthFilter = moment(monthFilter).format('MMM');
  }

  $('.purchase time').each(function(i, item) {
    var purchaseDate = parseInt($(item).attr('datetime'));
    if (moment(purchaseDate).format('MMM') !== monthFilter) {
      $(item).closest('.purchase').hide();
    }
  });
}

function calculateDaysSince(startDate) {
  //Calculate exact days ago
  var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  var now = new Date();
  var amountOfDays = Math.round(Math.abs((startDate - now.getTime()) / (oneDay)));
  return amountOfDays;
}

//Grab initial data from DB and populate UI
firebaseDB.on("value", function(snap) {
  var currentTimestamp = Date.now();

  //First time start up initializers
  //If user has no balance, let's set up the app for first use
  if (snap.val().balance === undefined) {
    //Create a recurring payment at first date
    var startingDate = currentTimestamp;
    var nextDate = moment(startingDate).add(1, 'month').unix() * 1000;

    var initBalance;
    if ($('#monthlyAllowance').val() === "") {
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
  if (parseInt(currentTimestamp) > parseInt(snap.val().nextPaymentDate)) {
    var updateBalance = parseInt(snap.val().balance);
    var updateNextPaymentDate = snap.val().nextPaymentDate;
    updateNextPaymentDate = moment(updateNextPaymentDate).add(1, 'month').unix() * 1000;
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
  var constructorTotalDaysSinceStart = '';
  var constructorAverages = '';
  var totalDaysSinceStart = calculateDaysSince(snap.val().startingDate);
  var totalThisMonth = 0;
  var totalThisYear = 0;
  var grandTotalMonth = 0;
  var grandTotalYear = 0;

  for (var i in allPurchases) {
    constructorPurchases += "<h2 class='flex-row text-info'>" + i + "</h2><div class='flexbox-container margin-top'>";

    //Collect totals information
    constructorTotals += '<div class="row"><div class="col-xs-4">' + i + '</div>';

    //Construct averages
    constructorAverages += '<div class="row"><div class="col-xs-6 text-right">' + i + '</div>';

    for (var j in allPurchases[i]) {
      //Purchase history
      constructorPurchases += '<div class="box flex-item purchase text-left">';
      constructorPurchases += '<p>Name: <strong>' + allPurchases[i][j].name + '</strong></p>';
      constructorPurchases += '<p>Price: <strong>' + parseFloat(allPurchases[i][j].price).toFixed(2) + ' &euro;</strong></p>';
      constructorPurchases += '<p>Date: <strong><time datetime="' + allPurchases[i][j].timestamp + '">' + moment(allPurchases[i][j].timestamp).format("Do MMM YYYY") + '</time></strong></p>';
      constructorPurchases += '</div>';

      //Check whether to add purchase to current month or current year
      if (moment(currentTimestamp).format("MMM") == moment(allPurchases[i][j].timestamp).format("MMM")) {
        //Purchse was done in the current month
        totalThisMonth += parseFloat(allPurchases[i][j].price);
      }
      if (moment(currentTimestamp).format("YYYY") == moment(allPurchases[i][j].timestamp).format("YYYY")) {
        //Purchase in the current year
        totalThisYear += parseFloat(allPurchases[i][j].price);
      }
    }
    constructorPurchases += "</div>";

    //Fix to 2 decimal places
    constructorTotals += '<div class="col-xs-4 text-success"><strong>' + totalThisMonth.toFixed(2) + ' &euro;</strong></div><div class="col-xs-4 text-info"><strong>' + totalThisYear.toFixed(2) + ' &euro;</strong></div></div>';

    //Calculate the averages per day
    constructorAverages += '<div class="col-xs-6 text-left"><strong>' + (totalThisYear / totalDaysSinceStart).toFixed(2) + ' &euro;</strong></div></div>';

    //Add the current total to the grand total
    grandTotalMonth += totalThisMonth;
    grandTotalYear += totalThisYear;

    //Reset total counters for next itiration
    totalThisMonth = 0;
    totalThisYear = 0;
  }

  constructorGrandTotal = '<div class="col-xs-4"><strong>Grand Total</strong></div><div class="col-xs-4 text-success"><strong>' + grandTotalMonth.toFixed(2) + ' &euro;</strong></div><div class="col-xs-4 text-info"><strong>' + grandTotalYear.toFixed(2) + ' &euro;</strong></div>';

  constructorAverageTotal = '<div class="col-xs-6 text-right grand-total"><strong>Average Total</strong></div><div class="col-xs-6 text-primary text-left grand-total"><strong>' + (grandTotalYear / totalDaysSinceStart).toFixed(2) + ' &euro;</strong></div>';

  //Calculate the average values per day
  constructorTotalDaysSinceStart += '<h4 class="flex-row">Total amount of days since start: <strong>' + totalDaysSinceStart + '</strong> (' + moment(snap.val().startingDate).format("Do MMM YYYY") + ')</h4>';

  //Update the UI
  $('#grand-total').html(constructorGrandTotal);
  $('#totals').html(constructorTotals);
  $('#purchases').html(constructorPurchases);
  $('#average-spendings').html(constructorTotalDaysSinceStart);
  $('#average-spendings').append(constructorAverages);
  $('#average-spendings').append(constructorAverageTotal);
  $('#monthlyAllowance').val(snap.val().monthlyAllowance);
  $('#currentBalance').html("<strong>" + snap.val().balance.toFixed(2) + "</strong>");
  $('#nextPayment').html("<strong>" + moment(snap.val().nextPaymentDate).endOf('day').fromNow() + "</strong><br>On: <strong>" + moment(snap.val().nextPaymentDate).format("Do MMM YYYY") + "</strong>");

  //Set monthly filter selected to current month
  $('#filterByMonth').val(moment(currentTimestamp).format("MMM"));
  //Update UI with current month filter
  filterByMonth();
});


//UI
//
//Login button
$('#btnLogin').click(function() {
  login($('#user').val(), $('#pass').val());
});

//Save settings button
$('#btnSaveSettings').click(function() {
  var allowance = parseInt($('#monthlyAllowance').val());
  firebaseDB.update({
    monthlyAllowance: allowance
  });
});

//Add expense button
$('#btnAddExpense').click(function() {
  var exName = $('#expenseName').val();
  var exPrice = $('#expenseValue').val();
  var exCategory = $('#expenseCategory').val();
  var date = Date.now();

  if (validateInput(exName) && validateInput(exPrice) && validateInput(exCategory)) {
    //Save the purchase to FB
    firebaseDB.child('/purchases/' + exCategory).push({
      name: exName,
      price: exPrice,
      timestamp: date
    });

    //Update the current balance
    var oldBalance = '';
    firebaseDB.once('value', function(snap) {
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

//Filter by month button
$('#filterByMonth').on('change', function() {
  filterByMonth($(this).val());
});

//Show all purchases
$('#filterShowAll').on('click', function() {
  $('.purchase').show();
});
