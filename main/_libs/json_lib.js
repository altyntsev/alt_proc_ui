function wrap_string(value, indent = '', max_len = 80) {
    let words = value.split(' ');
    let len = 0;
    for (let i = 0; i < words.length; i++) {
        len = len + words[i].length + 1;
        if (len > max_len) {
            len = 0;
            words.splice(i, 0, `\n${indent}  `);
        }
    }
    return words.join(' ');
}
function yaml_dump_iter(html, data, indent, remove_meta) {
    for (const attr in data) {
        if (remove_meta && (attr[0] == '_' ||
            attr.substr(attr.length - 2) == '__' || attr == 'yaml'))
            continue;
        let value = data[attr];
        const type = typeof value;
        if (type === 'string')
            value = wrap_string(value, indent);
        const line = `${indent}<span class="yaml_tag">${attr}</span>:`;
        if (['string', 'number', 'boolean'].includes(type)) {
            html.push(line + ` ${value}`);
        }
        else if (Array.isArray(value)) {
            if (['string', 'number', 'boolean'].includes(typeof value[0]))
                html.push(line + ` [${value}]`);
            else {
                html.push(line);
                for (const item of value) {
                    yaml_dump_iter(html, item, indent + '  - ', remove_meta);
                }
            }
        }
        else if (type === 'object') {
            html.push(line);
            yaml_dump_iter(html, value, indent + '    ', remove_meta);
        }
        indent = indent.replace('-', ' ');
    }
}
function yaml_dump(data, remove_meta = true) {
    const html = [];
    yaml_dump_iter(html, data, '', remove_meta);
    return '<pre>' + html.join('<br>') + '</pre>';
}
function obj_diff_iter(data0, data1) {
    for (const attr of Object.keys(data0)) {
        const value0 = data0[attr];
        const type0 = typeof value0;
        const value1 = data1[attr];
        const type1 = typeof value1;
        if (value1 === undefined)
            continue;
        if (type0 !== type1)
            continue;
        if (['string', 'number', 'boolean'].includes(type0)) {
            if (value0 === value1) {
                delete data0[attr];
                delete data1[attr];
            }
            continue;
        }
        if (type0 === 'object' && Array.isArray(value0) && Array.isArray(value1)) {
            const item_type = typeof value0[0];
            for (let i0 = value0.length - 1; i0 >= 0; i0--) {
                let eq = false, i1;
                const item0 = value0[i0];
                if (['string', 'number', 'boolean'].includes(item_type)) {
                    i1 = value1.indexOf(item0);
                    eq = i1 !== -1;
                }
                if (item_type === 'object') {
                    for (i1 = 0; i1 < value1.length; i1++) {
                        const diff = obj_diff(item0, value1[i1]);
                        if (diff.equal) {
                            eq = true;
                            break;
                        }
                    }
                }
                if (eq) {
                    value0.splice(i0, 1);
                    value1.splice(i1, 1);
                }
            }
            data0[attr] = value0;
            data1[attr] = value1;
            if (data0[attr].length === 0)
                delete data0[attr];
            if (data1[attr].length === 0)
                delete data1[attr];
        }
        if (type0 === 'object' && !Array.isArray(value0) && !Array.isArray(value1)) {
            obj_diff_iter(value0, value1);
            if (empty(data0[attr]))
                delete data0[attr];
            if (empty(data1[attr]))
                delete data1[attr];
        }
    }
}
function obj_diff(data0, data1) {
    const diff0 = JSON.parse(JSON.stringify(data0));
    const diff1 = JSON.parse(JSON.stringify(data1));
    obj_diff_iter(diff0, diff1);
    return {
        equal: empty(diff0) && empty(diff1),
        diff0: diff0,
        diff1: diff1
    };
}
