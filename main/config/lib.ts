export async function init_project_name_menu() {
    const project_id = get_url_params().project_id
    const project = await ajax_get('/project/item', {project_id: project_id})
    el('#menu-project_name').innerHTML = project.name
    el('#menu-project_name').style.display = 'block'
    el('#menu-files').style.display = 'block'

    return project
}
