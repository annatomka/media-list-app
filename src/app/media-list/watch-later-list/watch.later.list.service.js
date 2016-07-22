import { StorageService } from '../../../framework/storage/storage.service';
import { STORAGE_ID_WATCH_LATER, EVENT_MEDIA_LIST_UPDATED } from '../../app.constants';

export class WatchListService {
    constructor(eventEmitter, storageService) {
        this.eventEmitter = eventEmitter;
        this.storageService = storageService;
        this.watchListEntries = [];
        this.loadWatchListEntriesFromStorage();
    }

    loadWatchListEntriesFromStorage() {
        this.watchListEntries = this.storageService.get(STORAGE_ID_WATCH_LATER);
        if (!this.watchListEntries) {
            this.watchListEntries = [];
            this.storageService.add(STORAGE_ID_WATCH_LATER, []);
        }
    }

    getWatchList() {
        return this.watchListEntries.map((entry)=>this.getCachedMediaForEntry(entry));
    }

    getCachedMediaForEntry(entry) {
        let mediaItem = this.mediaListCache[entry.mediaId];
        mediaItem.addedAt = entry.addedAt;
        return mediaItem;
    }

    updateWatchList(mediaListCache) {
        this.updateMediaListCache(mediaListCache);
        this.watchListEntries = this.selectCachedMediaItemForWatchList();
        this.updateWatchListInStorage();
    }

    updateMediaListCache(mediaListCache) {
        this.mediaListCache = mediaListCache;
    }

    selectCachedMediaItemForWatchList() {
        let updatedWatchListEntries = [];
        this.watchListEntries.forEach((entry) => {
            let mediaItem = this.mediaListCache[entry.mediaId];
            if (mediaItem) {
                updatedWatchListEntries.push(entry);
            }
        });

        return updatedWatchListEntries;
    }

    updateWatchListInStorage() {
        this.storageService.add(STORAGE_ID_WATCH_LATER, this.watchListEntries);
    }

    addToWatchList(id) {
        this.watchListEntries.push({mediaId: id, addedAt: new Date()});
        this.updateWatchListInStorage();
    }

    removeFromWatchList(id) {
        this.watchListEntries = this.watchListEntries.filter((entry) => {
            return entry.mediaId !== id;
        });
        this.updateWatchListInStorage();
    }
}