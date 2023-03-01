import $ from "jquery";
import React from "react";



window.dataLayer = window.dataLayer || [];

export const scrollToTop = () => {
    let path = window.location.pathname;
    let page = path.split("/").pop();


    window.scrollTo(0, 0);
}


export const transformRequest = (array) => {
    let str = [];
    for (let p in array)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(array[p]));
    return str.join("&");
}

export const _accordion = () => {
    var oAccordion = $('.accordion-container');

    if (oAccordion.length > 0) {

        var oAccItem = oAccordion.find('.accordion-item'),
            oAccTrigger = oAccordion.find('.accordion-toggler');

        oAccordion.each(function (i, accordion) {
            $(accordion).find('.accordion-item:eq(0)').addClass('active');
        });

        oAccTrigger.on('click', function (j) {
            j.preventDefault();

            var $this = $(this),
                parent = $this.parent(),
                dropDown = $this.next('article');

            parent.toggleClass('active').siblings(oAccItem).removeClass('active').find('article').not(dropDown).slideUp();

            dropDown.stop(false, true).slideToggle();

            return false;
        });
    }

};


export const numberFormat = (value) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(value);

export const scrollTo = (hash) => {
    const scrollToAnchor = () => {
        const hashParts = hash.split('#');
        if (hashParts.length > 2) {
            const hash = hashParts.slice(-1)[0];
            document.querySelector(`#${hash}`).scrollIntoView();
        }
    };
    scrollToAnchor();
    window.onhashchange = scrollToAnchor;
}


export const validUrl = (string) => {
    if (!string) {
        return false;
    }
    return string.replace(/[^a-zA-Z0-9]/g, '-');
}

export const objToArray = (data, key) => {
    if (data) {
        let result = [];
        for (let i in data) {
            if (i && data[i]) {
                if (!key) {
                    data[i]['__key'] = i;
                }
                result.push(data[i]);
            }
        }
        return result;
    }
};

export const getNestedChildren = (arr, find, mid, id) => {
    var out = [];
    for (let i in arr) {
        if (arr[i][mid] === find) {
            let sub = getNestedChildren(arr, arr[i][id], mid, id);
            arr[i].sub = sub;
            out.push(arr[i]);
        }
    }
    return out
};

export const nestedGroupList = (arr, find, mid, id, module) => {
    if (arr) {
        return Object.values(arr).filter((pg) => {
            return pg[mid] === find;
        }).map((pg => {
            return {...pg, module: pg[module], children: nestedGroupList(arr, pg[id], mid, id, module)}
        }));
    } else {
        return []
    }
};


export const clone = (obj) => {
    var copy;
    if (null == obj || "object" != typeof obj) return obj;
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }
    throw new Error("Unable to copy obj! Its type isn't supported.");
};

export const map = (object, callback) => {
    return Object.keys(object).map(function (key) {
        return callback(key, object[key]);
    });
};

export const findObject = (array, field, value) => {
    let find = array.filter(function (item) {
        return item[field] === value
    });
    return find[0];
};


export const filterObject = (array, field, value) => {
    let find = array.filter(function (item) {
        return item[field] === value
    });
    return find;
};

export function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0) return false;
    if (obj.length === 0) return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}


export const wait = (time, signal) => {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            resolve();
        }, time);
        signal?.addEventListener('abort', () => {
            clearTimeout(timeoutId);
            reject();
        });
    });
}


export const shortName = (str) => {

    if (Boolean(str)) {
        const firstLetters = str
            .split(' ')
            .map((word) => word[0])
            .join('');
        return firstLetters.substring(0, 2).toUpperCase();
    }
    return
}
