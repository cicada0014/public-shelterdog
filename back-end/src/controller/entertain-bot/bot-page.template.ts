


export let createPageTemplate = (url, title, keywords, description, content, imgUrl?) => {


    return `
    
    <!DOCTYPE html>
    <html>
        <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1,user-scalable=no">
        <title>${title} </title>
        <style>
            html{
                width:100%;
                
            };
            body{
                width:100%;
                padding : 5px;
            }
            iframe{
                width:100%;
            }
            a{
                margin-top:20px;
                margin-bottom:10px;
            };
            img{
                max-width:100%;
                width:100%;
            };
        </style>
        <meta name="keywords" content="${keywords}">
        <meta name="description" content="${description}">
        
            <meta property="og:title" content="${title} ">
            <meta property="og:description" content="${description}">
            <meta property="og:type" content="website" />
            <meta property="og:url" content="${url}">
            <meta property="og:image" content="${ imgUrl ? imgUrl : 'https://s3.ap-northeast-2.amazonaws.com/article.images/02/1f/71/ec/99/7f/f9/2a/de/91/92/0a/5c/9d/30/87/shelterdog_open_graph_image.png'}">
            <meta property="fb:app_id" content="2353715348233695" /> 
            <script type=”application/ld+json”> { "@context" : "http://schema.org" , "@type" : "WebSite" , "url" :
            "https://shelterdog.net/" , "name" : "Shelter Dog (쉘터독)" , "author" : { "@type" : "Person" , "name" : "ShelterDog"
            }, "description" : "마음 속 응어리를 풀어내는 공간, 싫어하는 것을 자유롭게 소통하는 커뮤니티!" , "sameAs" : [
            "https://www.facebook.com/shelterdogpage" , "https://twitter.com/ShelterDog3" ,
            "https://www.instagram.com/kim_shelter" , "https://www.youtube.com/channel/UCCQ0uoIag5dAN9-ZSlHZBjQ" ] } </script>
            <link rel="canonical" href="https://shelterdog.net/refuges" />
        </head>
        <body>
        <h1> ${title} </h1>
        <h2> ${keywords} </h2>
            ${content}
        </body>
    </html>
    `
}




