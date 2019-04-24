var URL = "http://" + window.location.host
function load_my_offers() {
  $.ajax({
    url:URL +  "/me/offers",
    type: "GET",
    dataType: 'json',
    contentType: 'application/json',
    crossDomain: true,
    success: function(data) {
      if (data == null) {
        return;
      }
      data.forEach(listMyOffer);
    }
  });
}

function listMyOffer(offer) {
  var offer_element = '<div id="'+ offer.id +'"class="my-offer"><div class="my-offer__content">'+
  '<div class="my-offer__image" style="background-image: url(https://source.unsplash.com/700x700/?product);">'+
  '</div><div class="my-offer__body"><h3 class="my-offer__title">'+offer.name+
  '</h3><p>'+offer.details+'</p><a class="btn-remove-my-offer"><span></span></a></div></div></div>'
  $("#my-offers").append(offer_element);
}


function add_offer() {
  console.log("offer added");
  var offer_data = {
    "name": $('#offer-title').val(),
    "details": $('#offer-description').val(),
    "image_url": "https://via.placeholder.com/150",
  }
  listMyOffer(offer_data);
  console.log(offer_data);
  $.ajax({
    url:  URL +  "/offers",
    type: "POST",
    data: JSON.stringify(offer_data),
    dataType: 'json',
    contentType: 'application/json',
    crossDomain: true,
    success: function(data) {
      console.log(data);
    }
  });
}

(function($) {
  URL = "http://" + window.location.host;
  console.log('url', URL);
  // Document Ready
  $(document).ready(function() {
    load_my_offers();
  });

})(jQuery);
