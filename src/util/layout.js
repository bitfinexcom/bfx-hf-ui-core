const LOCAL_STORAGE_LAST_USED_LAYOUT_ID = 'LAST_USED_LAYOUT_ID'

export const storeLastUsedLayoutID = (id, routePath) => localStorage.setItem(`${LOCAL_STORAGE_LAST_USED_LAYOUT_ID}_${routePath}`, id)

export const getLastUsedLayoutID = (routePath) => localStorage.getItem(`${LOCAL_STORAGE_LAST_USED_LAYOUT_ID}_${routePath}`)
