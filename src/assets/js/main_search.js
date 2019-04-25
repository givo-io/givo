/*jshint esversion: 8 */
var Data = [];

function item_disliked(cntr) {
  offer = Data[cntr];
  $("#card-" + cntr).remove();

  if (offer.is_reference == false) {
    return;
  }

  if (cntr == (Data.length-1)) {
    if (offer.is_reference == true) {
      send_my_interest_reference(offer);
      Storage.set_last_block("refer", offer.block_number+1);
    }
    return;
  }

  next_offer = Data[cntr + 1];
  if (next_offer.owner != offer.owner) {
    console.log("Done");
    send_my_interest_reference(offer);
    Storage.set_last_block("refer", offer.block_number+1);
  }
  return;
}

function send_interest(my_interest, offer){
  App.contract.refer_intrest(my_interest, offer.owner,
    App.options,
    function(err, result) {
      if (!err) {
        console.log('intrest refer:');
        console.log(result);
      } else {
        console.log(err);
      }
    });
}
// TODO: create a map of que of reference_id to referer to use it for cycle_propagate
function send_my_interests_reference(offer) {
  my_interests = Storage.get_my_interests();
  my_interests.forEach(function(interest){
      refer_interest(interest, offer.owner);
  });
}

function refer_interest(interested_good_id, reference_id){
  App.contract.refer_intrest(interested_good_id, reference_id,
    App.options,
    function(err, result) {
      if (!err) {
        console.log('intrest added:');
        console.log(result);
      } else {
        console.log(err);
      }
    });
}


function item_liked(cntr) {
  offer = Data[cntr];
  Storage.set_interest(offer.id);
  $("#card-" + offer.id).remove();
  add_interest_button(offer.id);
  if (offer.is_reference == true) {
    initiate_cycle(offer);
    return;
  }
  send_interest(offer);
}

function send_interest(offer) {
  App.contract.add_interest(offer.id,
    App.options,
    function(err, result) {
      if (!err) {
        console.log('intrest added:');
        console.log(result);
      } else {
        console.log(err);
      }
    });
}


async function initiate_cycle(offer) {
  my_offer_details = await App.get_offer_details(offer.referer_interest);
  Popup(
    my_offer_details[0],
    "Please drop This good to the following location",
    offer.name,
    "You will get This good soon!!"
  );
  App.contract.cycle_formed(
    offer.owner,
    offer.id,
    offer.referer_interest,
    offer.referer,
    App.options,
    function(err, result) {
      if (!err) {
        console.log("Cycle Formed!");
      } else {
        console.log(err);
      }
    });

}



function add_interest_button(id) {
  App.contract.all_goods(id,
    App.options,
    function(err, result) {
      if (!err) {
        var interest = '<li id="intrest-' + id + '" onclick="delete_intrest(' + id + ')" class="filled" style="background-image: url(' + result[5] + ');">+</li>';
        $("#my-interest").append(interest);
      } else {
        console.log(err);
      }
    });
}


function load_interests() {
  my_interests = Storage.get_my_interests();
  my_interests.forEach(add_interest_button);
}


function delete_intrest(id) {
  $('#intrest-' + id).remove();
  $.ajax({
    url: URL + '/interest/' + id,
    type: 'DELETE',
    crossDomain: true,
    success: function(result) {
      console.log(result);
    }
  });
}

var prevOffer = null;

function slideChange() {
  //console.log($(".offer .swiper-slide .swiper-slide-prev"));
}

function add_card(id, name, details, image_url, owner, is_reference, referer, referer_interest, block_number) {
  card_data = {
    id: id,
    owner: owner,
    name: name,
    details: details,
    image_url: image_url,
    is_reference: is_reference,
    referer: referer,
    referer_interest: referer_interest,
    block_number: block_number
  };
  var cntr = Data.push(card_data)-1;
  var card = '<div class="offer swiper-slide" id="card-' + cntr + '"><div class="offer__content" style="background-image: url(' + image_url + ');"><div class="offer__body"><h3 class="offer__title">' + name + '-' + id + '</h3><small class="offer__user">by Elit Numquam</small><p>' + details + '</p></div><div class="offer__meta"><ul><li><strong>4</strong>Likes</li><li><strong>11</strong>Trades</li><li><strong>680</strong>Respect</li></ul>' +
    '<button class="btn-interested" data-counter="' + cntr + '" id="' + id + '"  onclick="item_liked(' + cntr + ')"><span>+</span></button>' +
    '<button class="btn-not-interested"  data-counter="' + cntr + '" id="' + id + '"  onclick="item_disliked(' + cntr + ')"><span>&times;</span></button></div></div></div>';
  $(".swiper-wrapper").prepend(card);
}

function add_offer(offer_id, is_reference, referer, referer_interest, block_number) {
  App.contract.all_goods(offer_id,
    App.options,
    function(err, result) {
      if (!err) {
        add_card(offer_id, result[3], result[5], result[4],
          result[0], is_reference, referer, referer_interest, block_number);
      } else {
        console.log(err);
      }
    });
}

function populate_offers() {
  App.contract.max_all_good(
    App.options,
    function(err, result) {
      if (!err) {
        //console.log(result)
        for (var id = 0; id <= result; id++) {
          add_offer(id, false, null, null, null);
        }
      } else {
        console.log(err);
      }
    });
}

async function on_contract_loaded() {
  populate_offers();
  Events.init_events();
  load_interests();
}

(function($) {
  // Document Ready
  $(document).ready(function() {
    App.init(on_contract_loaded);
  });

  var swiper = new Swiper('.swiper-container', {
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 0,
    grabCursor: true,
  });

  swiper.on('slideChange', function() {
    slideChange();
  });
})(jQuery);
