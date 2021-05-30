/*! Eve 0.5.0 - JavaScript Events Library
 * Author Dmitry Baranovskiy (http://dmitry.baranovskiy.com/)
 *
 * Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License. */

var version = '0.5.0',
  has = 'hasOwnProperty',
  separator = /[\.\/]/,
  comaseparator = /\s*,\s*/,
  wildcard = '*',
  numsort = (a, b) => a - b,
  current_event,
  stop,
  events = { n: {} },
  firstDefined = function () {
    for (var i = 0, ii = this.length; i < ii; i++) {
      if (typeof this[i] != 'undefined') {
        return this[i]
      }
    }
  },
  lastDefined = function () {
    var i = this.length
    while (--i) {
      if (typeof this[i] != 'undefined') {
        return this[i]
      }
    }
  },
  Str = String,
  isArray = Array.isArray

/** eve Fires event with given `name`, given scope and other parameters.
 * @param name (string) name of the *event*, dot (`.`) or slash (`/`) separated
 * @param scope (object) context for the event handlers
 * @param varargs (...) the rest of arguments will be sent to event handlers.
 * @returns (object) array of returned values from the listeners. Array has two methods `.firstDefined()` and `.lastDefined()` to get first or last not `undefined` value.
 */
var eve = function (name, scope) {
  var oldStop = stop,
    args = Array.prototype.slice.call(arguments, 2),
    listeners = eve.listeners(name),
    z = 0,
    l,
    indexed = [],
    queue = {},
    out = [],
    ce = current_event
  out.firstDefined = firstDefined
  out.lastDefined = lastDefined
  current_event = name
  stop = 0
  for (var i = 0, ii = listeners.length; i < ii; i++)
    if ('zIndex' in listeners[i]) {
      indexed.push(listeners[i].zIndex)
      if (listeners[i].zIndex < 0) {
        queue[listeners[i].zIndex] = listeners[i]
      }
    }
  indexed.sort(numsort)
  while (indexed[z] < 0) {
    l = queue[indexed[z++]]
    out.push(l.apply(scope, args))
    if (stop) {
      stop = oldStop
      return out
    }
  }
  for (i = 0; i < ii; i++) {
    l = listeners[i]
    if ('zIndex' in l) {
      if (l.zIndex == indexed[z]) {
        out.push(l.apply(scope, args))
        if (stop) {
          break
        }
        do {
          z++
          l = queue[indexed[z]]
          l && out.push(l.apply(scope, args))
          if (stop) {
            break
          }
        } while (l)
      } else {
        queue[l.zIndex] = l
      }
    } else {
      out.push(l.apply(scope, args))
      if (stop) {
        break
      }
    }
  }
  stop = oldStop
  current_event = ce
  return out
}
// Undocumented. Debug only.
eve._events = events
/** eve.listeners
 * Internal method which gives you array of all event handlers that will be triggered by the given `name`.
 * @param name (string) name of the event, dot (`.`) or slash (`/`) separated
 * @returns (array) array of event handlers
 */
eve.listeners = name => {
  var names = isArray(name) ? name : name.split(separator),
    e = events,
    item,
    items,
    k,
    i,
    ii,
    j,
    jj,
    nes,
    es = [e],
    out = []
  for (i = 0, ii = names.length; i < ii; i++) {
    nes = []
    for (j = 0, jj = es.length; j < jj; j++) {
      e = es[j].n
      items = [e[names[i]], e[wildcard]]
      k = 2
      while (k--) {
        item = items[k]
        if (item) {
          nes.push(item)
          out = out.concat(item.f || [])
        }
      }
    }
    es = nes
  }
  return out
}
/** eve.separator
 * If for some reasons you don’t like default separators (`.` or `/`) you can specify yours here. Be aware that if you pass a string longer than one character it will be treated as a list of characters.
 * @param separator (string) new separator. Empty string resets to default: `.` or `/`.
 */
eve.separator = sep => {
  if (sep) {
    sep = Str(sep).replace(/(?=[\.\^\]\[\-])/g, '\\')
    sep = '[' + sep + ']'
    separator = new RegExp(sep)
  } else {
    separator = /[\.\/]/
  }
}
/** eve.on
 * Binds given event handler with a given name. You can use wildcards “`*`” for the names:
 * eve.on("*.under.*", f);
 * eve("mouse.under.floor"); // triggers f
 * Use eve to trigger the listener.
 * @param name (string) name of the event, dot (`.`) or slash (`/`) separated, with optional wildcards
 * @param  f (function) event handler function
 * @param name (array) if you don’t want to use separators, you can use array of strings
 * @param  f (function) event handler function
 * @returns (function) returned function accepts a single numeric parameter that represents z-index of the handler. It is an optional feature and only used when you need to ensure that some subset of handlers will be invoked in a given order, despite of the order of assignment.
 *  > Example:
 *  eve.on("mouse", eatIt)(2);
 *  eve.on("mouse", scream);
 *  eve.on("mouse", catchIt)(1);
 * This will ensure that `catchIt` function will be called before `eatIt`.
 *
 * If you want to put your handler before non-indexed handlers, specify a negative value.
 * Note: I assume most of the time you don’t need to worry about z-index, but it’s nice to have this feature “just in case”.
 */
eve.on = (name, f) => {
  if (typeof f != 'function') {
    return () => 0
  }

  for (
    var names = isArray(name)
        ? isArray(name[0])
          ? name
          : [name]
        : Str(name).split(comaseparator),
      i = 0,
      ii = names.length,
      names1,
      e,
      exist,
      j,
      jj;
    i < ii;
    i++
  ) {
    for (
      name = names[i],
        exist = 0,
        e = events,
        names1 = isArray(name) ? name : Str(name).split(separator),
        j = 0,
        jj = names1.length;
      j < jj;
      j++
    ) {
      e = e.n
      e = (e.hasOwnProperty(names1[j]) && e[names1[j]]) || (e[names1[j]] = { n: {} })
    }
    for (e.f = e.f || [], j = 0, jj = e.f.length; j < jj; j++)
      if (e.f[j] == f) {
        exist = 1
        break
      }
    exist || e.f.push(f)
  }

  return zIndex => {
    if (+zIndex == +zIndex) {
      f.zIndex = +zIndex
    }
  }
}
/** eve.f
 * Returns function that will fire given event with optional arguments.
 * Arguments that will be passed to the result function will be also
 * concated to the list of final arguments.
 * el.onclick = eve.f("click", 1, 2);
 * eve.on("click", function (a, b, c) {
 *   console.log(a, b, c); // 1, 2, [event object]
 * });
 * @param event (string) event name
 * @param varargs (…) and any other arguments
 * @returns (function) possible event handler function
 */
eve.f = function (event) {
  var attrs = [].slice.call(arguments, 1)
  return function () {
    eve.apply(null, [event, null].concat(attrs).concat([].slice.call(arguments, 0)))
  }
}
/**eve.stop
 * Is used inside an event handler to stop the event, preventing any subsequent listeners from firing.
 */
eve.stop = () => {
  stop = 1
}
/** eve.nt
 * Could be used inside event handler to figure out actual name of the event.
 * @param event subname (string) #optional subname of the event
 * @returns (string) name of the event, if `subname` is not specified
 * @returns (boolean) `true`, if current event’s name contains `subname`
 */
eve.nt = subname => {
  var cur = isArray(current_event) ? current_event.join('.') : current_event
  return subname
    ? new RegExp('(?:\\.|\\/|^)' + subname + '(?:\\.|\\/|$)').test(cur)
    : cur
}
/** eve.nts
 * Could be used inside event handler to figure out actual name of the event.
 * @returns (array) names of the event
 */
eve.nts = a => (isArray(current_event) ? current_event : current_event.split(separator))
/** eve.off
 * Removes given function from the list of event listeners assigned to given name.
 * If no arguments specified all the events will be cleared.
 * @param name (string) name of the event, dot (`.`) or slash (`/`) separated, with optional wildcards
 * @param f (function) event handler function
 */
/** eve.unbind
 * See @eve.off
 */
eve.off = eve.unbind = (name, f) => {
  if (!name) {
    eve._events = events = { n: {} }
    return
  }

  var names = isArray(name)
    ? isArray(name[0])
      ? name
      : [name]
    : Str(name).split(comaseparator)
  if (names.length > 1) {
    for (var i = 0, ii = names.length; i < ii; i++) {
      eve.off(names[i], f)
    }
    return
  }

  names = isArray(name) ? name : Str(name).split(separator)
  var e,
    key,
    splice,
    i,
    ii,
    j,
    jj,
    cur = [events]
  for (i = 0, ii = names.length; i < ii; i++) {
    for (j = 0; j < cur.length; j += splice.length - 2) {
      splice = [j, 1]
      e = cur[j].n
      if (names[i] != wildcard) {
        if (e[names[i]]) {
          splice.push(e[names[i]])
        }
      } else {
        for (key in e)
          if (e[has](key)) {
            splice.push(e[key])
          }
      }
      cur.splice.apply(cur, splice)
    }
  }
  for (i = 0, ii = cur.length; i < ii; i++) {
    e = cur[i]
    while (e.n) {
      if (f) {
        if (e.f) {
          for (j = 0, jj = e.f.length; j < jj; j++)
            if (e.f[j] == f) {
              e.f.splice(j, 1)
              break
            }
          !e.f.length && delete e.f
        }
        for (key in e.n)
          if (e.n[has](key) && e.n[key].f) {
            var funcs = e.n[key].f
            for (j = 0, jj = funcs.length; j < jj; j++)
              if (funcs[j] == f) {
                funcs.splice(j, 1)
                break
              }
            !funcs.length && delete e.n[key].f
          }
      } else {
        delete e.f
        for (key in e.n)
          if (e.n[has](key) && e.n[key].f) {
            delete e.n[key].f
          }
      }
      e = e.n
    }
  }
}
/** eve.once
 * Binds given event handler with a given name to only run once then unbind itself.
 * eve.once("login", f);
 *  eve("login"); // triggers f
 *  eve("login"); // no listeners
 * Use eve to trigger the listener.
 * @param name (string) name of the event, dot (`.`) or slash (`/`) separated, with optional wildcards
 * @param f (function) event handler function
 * @returns (function) same return function as @eve.on
 */
eve.once = (name, f) => {
  var f2 = function () {
    eve.off(name, f2)
    return f.apply(this, arguments)
  }

  return eve.on(name, f2)
}
/** eve.version
 * Current version of the library.
 */
eve.version = version
eve.toString = () => 'You are running Eve ' + version

export { eve }
