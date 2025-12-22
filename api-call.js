  const container = document.getElementById('main');

  fetch('https://cms.nickmiller.tech/wp-json/wp/v2/pages')
    .then(response => response.json())
    .then(pages => {
      // For this example, grab the first page
      const firstPage = pages[0];

      console.log('container:\n', container);
      console.log('firstPage:\n', firstPage);

      // Get title and ACF subtitle if it exists
    //   const title = firstPage.title.rendered;
    //   const subtitle = firstPage.acf ? firstPage.acf.subtitle : '';


    // Target the first H2 inside the container
    const h2 = container.querySelector('h2');
    console.log(h2.textContent); // "Subtitle"

    console.log(container.querySelector('h2').innerHTML)
    console.log(firstPage.acf.test_field_group.test_field_01)

    // container.querySelector('h2').innerHTML = firstPage.acf.test_field_group.test_field_01;

      // Update the HTML
    //   container.innerHTML = `
    //     <h1>${title}</h1>
    //     <p>${subtitle}</p>
    //   `;
    })
    .catch(err => {
      console.error('Error fetching data:', err);
      container.innerHTML = 'Failed to load content.';
    });