const indexGenerator = () => {
    const file = `
    <div class="container mx-auto py-8">
  <h1 class="text-3xl font-bold mb-6">Models Schema</h1>

  <% schemas.forEach(function(schema) { %>
      <div class="mb-8 bg-white p-6 rounded-lg shadow-lg">
          <h2 class="text-2xl font-semibold mb-4"><%= schema.modelName %></h2>
          <table class="min-w-full bg-white">
              <thead>
                  <tr>
                      <th class="py-2 px-4 text-start border-b-2 border-gray-300">Field Name</th>
                      <th class="py-2 px-4 text-start border-b-2 border-gray-300">Type</th>
                      <th class="py-2 px-4 text-start border-b-2 border-gray-300">Required</th>
                      <th class="py-2 px-4 text-start border-b-2 border-gray-300">Select</th>
                  </tr>
              </thead>
              <tbody>
                  <% schema.schema.forEach(function(field) { %>
                      <tr>
                          <td class="py-2 px-4 border-b border-gray-200"><%= field.fieldName %></td>
                          <td class="py-2 px-4 border-b border-gray-200"><%= field.type %></td>
                          <td class="py-2 px-4 border-b border-gray-200"><%= field.required ? 'Yes' : 'No' %></td>
                          <td class="py-2 px-4 border-b border-gray-200"><%= field.select === false ? 'No' : 'Yes' %></td>
                      </tr>
                  <% }); %>
              </tbody>
          </table>
      </div>
  <% }); %>
</div>
    `

    return file
}

export default indexGenerator