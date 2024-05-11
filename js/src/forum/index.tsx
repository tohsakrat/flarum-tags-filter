import { extend } from 'flarum/common/extend';
import ItemList from 'flarum/common/utils/ItemList';
import app from 'flarum/forum/app';
import IndexPage from 'flarum/forum/components/IndexPage';
import DiscussionListState from 'flarum/forum/states/DiscussionListState';
import GlobalSearchState from 'flarum/forum/states/GlobalSearchState';

import LinkButton from 'flarum/forum/components/LinkButton';
import Link from 'flarum/forum/components/Link';

import TagsFilter from './components/UserAutocompleteDropdown';

import Search from 'flarum/forum/components/Search';


import type Mithril from 'mithril';

app.initializers.add('tohsakarat/tags-filter', () => {

  extend(IndexPage.prototype, 'viewItems', function (items: ItemList<Mithril.Children>) {
    if (app.current.data.routeName === 'byobuPrivate') return;

      items.add('tagsFilter', <TagsFilter />, -15);
    //if (!!app.forum.attribute('canUseBlomstraUserFilter')) {
    //}
  });
  
    extend(Search.prototype, 'oninit', function () {
    app.searchBar=this;
    setTimeout( ()=>{

    app.searchBar.element.querySelector('input').addEventListener('focus',()=>{
        if(m?.route?.param()?.q?.split(' ')?.filter)app.searchBar.searchState.value= m?.route?.param()?.q?.split(' ')?.filter((e)=>{return e.indexOf(':')==-1}).join(' ')
        
         })
    
    },
    1000)
        
    
    
  })

    


 
});
