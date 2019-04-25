/*jshint esversion: 8 */
async function load_my_offers() {
  my_offers = await get_my_offers();
  my_offers.forEach(async function(offer_id) {
    all_details = await get_offer_details(offer_id);
    add_offer_to_list(offer_id, all_details[0], all_details[1], all_details[2]);
  });
}

function add_offer_to_list(id, name, image_url, details) {
  var offer_element = '<div id="' + id + '"class="my-offer"><div class="my-offer__content">' +
    '<div class="my-offer__image" style="background-image: url(' + image_url + ');">' +
    '</div><div class="my-offer__body"><h3 class="my-offer__title">' + name +
    '</h3><p>' + details + '</p><a class="btn-remove-my-offer"><span></span></a></div></div></div>';
  $("#my-offers").append(offer_element);
}

async function get_my_offers() {
  id = await App.get_id();
  my_offers = promisify(cb => App.contract.get_offers(id, App.options, cb));
  return await my_offers;
}

async function get_offer_details(product_id) {
  offer_details = await promisify(cb => App.contract.all_goods(product_id, App.options, cb));
  return [offer_details[3], offer_details[4], offer_details[5]];
}

function add_offer() {
  console.log("offer added");
  register_offer(
    $('#offer-title').val(),
    "https://source.unsplash.com/random",
    $('#offer-description').val(),
  );

}

function register_offer(name, image_url, details) {
  App.contract.create_offer(
    name,
    image_url,
    details,
    App.options,
    function(err, result) {
      if (!err) {
        console.log("Offer created!");
        add_offer_to_list(null, name, image_url, details);
      } else {
        console.log(err);
      }
    });

}

async function on_contract_loaded() {
  load_my_offers();
}

(function($) {
  URL = "http://" + window.location.host;
  console.log('url', URL);
  // Document Ready
  $(document).ready(function() {
    App.init(on_contract_loaded);
  });

})(jQuery);
