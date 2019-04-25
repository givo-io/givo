/*jshint esversion: 8 */
// TODO: Remove from field from events as its already there
Events = {
  listen_refer: async function(id) {
    filter = {to: id};
    additional_filter = {fromBlock: Storage.get_last_block("refer"), toBlock: 'latest'};
    refer_event = App.contract.refer(filter, additional_filter);
    refer_event.watch(function(error, result){
     if (!error){
       console.log("Refer Event:");
       console.log(result);
       Events.react_on_refer(result);
     }
    });
  },

  react_on_refer: async function(result) {
    reference_offers = await App.get_offers(result.args.reference_id);
    common_offer = in_my_interest(reference_offers);
    if(common_offer.length==0){
      //the goods from reference_id is not in user's interest list
      reference_offers.forEach(function(offer_id){
        add_offer(offer_id, true, result.args.referer, result.args.referer_interest, result.blockNumber);
      });
    }else {
      //the goods from reference_id is already in user's interest list
      //initiate_cycle with first common good
      // TODO: ask user for which good would he like more?
      initiate_cycle(common_offer[0]);
    }
  },

  listen_chained: async function(id) {
    filter = {then_receiver: id};
    additional_filter = {fromBlock: Storage.get_last_block("chained"), toBlock: 'latest'};
    chained_event = App.contract.chained(filter, additional_filter);
    chained_event.watch(function(error, result){
     if (!error){
       console.log("Chained Event:");
       console.log(result);
       Events.react_on_chained(result);
     }
    });
  },

  react_on_chained: async function(result) {
    if(result.args.if_owner == await App.get_id()){
      Storage.set_last_block("chained",result.blockNumber+1);
      my_offer_details = await App.get_offer_details(result.args.if_good);
      Popup(
        my_offer_details[0],
        "Please drop This good to the" +result.args.if_receiver+ "'s location",
        result.args.then_good,
        "You will get This good soon!!"
      );
    }
    /*referer, referer_interest = Storage.get_referer(result.args.if_owner);
    Popup(
      referer_interest,
      "Please drop This good to the" +referer+ "'s location",
      result.args.then_good,
      "You will get This good soon!!"
    );*/
  },

  init_events: async function() {
      console.log("Events are initialised!!");
      id = await App.get_id();
      Events.listen_refer(id);
      Events.listen_chained(id);
  }

};
