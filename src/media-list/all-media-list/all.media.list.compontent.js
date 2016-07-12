import { EVENT_POLLING_RESULT, EVENT_WATCHLIST_ADD, EVENT_WATCHLIST_REMOVE } from '../../app.constants';
import { AllMediaListView } from './all.media.list.view';

export class AllMediaListComponent {
    constructor(eventEmitter, mediaListService) {
        this.eventEmitter = eventEmitter;
        this.mediaListService = mediaListService;
        this.view = new AllMediaListView(this);
    }

    activate() {
        console.log('all media list component activated');

        this.eventEmitter.on(EVENT_POLLING_RESULT, result => {
            this.onPollingResult(result);
            let testItem = result[0];
            //setTimeout(() => {
            //    this.eventEmitter.emit(EVENT_WATCHLIST_ADD, testItem.id);
            //}, 5000);
            //
            //setTimeout(() => {
            //    this.eventEmitter.emit(EVENT_WATCHLIST_REMOVE, testItem.id);
            //}, 15000);
        });
    }

    onPollingResult(result) {
        console.log('result arrived in all media list component: ', result.length);
        this.items = result;
        this.mediaListService.updateCache(this.items);
        this.view.render();
    }

    addToWatchLaterList(mediaId) {
        console.log("addToWatchLaterList called with param: ", mediaId);
        console.log(this);
        this.eventEmitter.emit(EVENT_WATCHLIST_ADD, mediaId);
    }
}