---
layout: post
title: Sysadmins, programação e os video games.
---

Não é segredo pra ninguém que me conhece que sou defensor de que o profissional de infraestrutura moderno deve saber programar.  

Conheci muitos sysadmins na minha carreira que já eram adeptos do shell script e que foram evoluindo para linguagens como python, ruby etc. Isso fez deles profissionais muito mais preparados para os desafios que encontramos hoje nos ambientes de administração de infraestrutura clássica ou cloud.  

O que pouca gente sabe é que meu interesse por programação nasceu fora do escritório e não foi para resolver nenhum problema ou automatizar nada. Foi para ter a experiência de como é produzir uma das coisas que mais amo na minha vida. Video games!

Não tenho aqui a pretensão de ser um inspirador para que ninguém comece a programar pelo mesmo motivo e nem achar que meu hobby é melhor do que o de ninguém, mas apenas compartilhar aqui com meus amigos como foi a minha experiência e um pouquinho de conhecimento "inútil".

Existem muitos frameworks para desenvolvimento de jogos por aí e todos eles envolvem conhecimentos de programação em maior ou menor grau. Um deles ficou muito famoso na geração do Xbox 360 pois permitiu a entrada de centenas de desenvolvedores independentes no cenário de desenvolvimento de jogos, estou falando do XNA da Microsoft (O documentário [Indie Game: The Movie](https://www.imdb.com/title/tt1942884/) mostra muito bem o sentimento que rolou naquela época).

Infelizmente a Microsoft descontinuou o XNA em meados de 2013 deixando órfãos muitos desenvolvedores das plataformas Windows e Xbox. A boa notícia é que mesmo antes do fim do XNA um projeto open source chamado [MonoGame](https://www.monogame.net/) foi iniciado em 2009 com o intuito de portar jogos do XNA para múltiplas plataformas.

Hoje com a morte do XNA e a evolução do MonoGame ele se tornou um framework totalmente autônomo e multiplataforma.

Quero compartilhar com vocês como criar um setup de desenvolvimento usando MonoGame, vscode e dotnet core no MacOs.

Para facilitar a instalação dos das libs e sdk's necessários eu recomendo a instalação do homebrew para MacOs.

Após a instalação do [homebrew](https://brew.sh/) você vai precisar instalar o dotnet core com o seguinte comando.

{% highlight bash %}
{% include code.html %}
brew install --cask dotnet-sdk
{% endhighlight %}

Se seu MacOs >= Sierra o homebrew vai instalar a versão 5 do dornet core sdk no momento em que eu escrevo esse artigo e o MonoGame ainda não está totalmente preparado para essa versão. Para contornar esse problema você pode instalar esse excelente [tap](https://github.com/isen-ng/homebrew-dotnet-sdk-versions) que permite a instalação de múltiplas versões do dotnet core sdk usando o homebrew. Basta executar.

{% include code.html %}
{% highlight bash %}
brew tap isen-ng/dotnet-sdk-versions
brew cask install dotnet-sdk3-1-400
{% endhighlight %}

O MonoGame também requer o Mono framework o qual você também pode instalar usando o homebrew.

{% highlight bash %}
brew install mono
{% endhighlight %}

Aqui eu recomendo também a instalação da lib freetype que irá auxiliar no processo de renderização de fonts nos seus futuros jogos.

{% highlight bash %}
brew install freetype
{% endhighlight %}

Também vamos precisar do [vscode](https://code.visualstudio.com/) e da extensão [ms-dotnettools.csharp](https://code.visualstudio.com/docs/introvideos/extend) para edição e debug do nosso código.

Agora precisamos clonar o projeto do MonoGame do repositório oficial no [github](https://github.com/MonoGame/MonoGame).

{% highlight bash %}
git clone https://github.com/MonoGame/MonoGame.git
{% endhighlight %}

Dentre os conteúdos do projeto existem alguns templates que devemos instalar acessando o diretório do projeto recém clonado e executando o comando abaixo.

{% highlight bash %}
dotnet new --install Templates/MonoGame.Templates.CSharp/content
{% endhighlight %}

Agora estamos quase prontos e o que precisamos fazer para criar um novo projeto de jogo é criar um novo diretório com o nome que você desejar e a partir dele executar o comando.

{% highlight bash %}
dotnet new mgdesktopgl
{% endhighlight %}

Isso vai criar alguns arquivos baseados no template que acabamos de instalar e podemos abrir o projeto no vscode usando o comando <em>"code ."</em> ou abrindo o vscode e usando o menu "file" normalmente.

Antes de tentar <em>"debugar"</em> o projeto é necessário criar alguns arquivos que irão ajudar no processo. Primeiro caso não exista, crie na raiz da aplicação um diretório chamado <em>".vscode"</em> de dentro dele os arquivos <em>"launch.json"</em> e <em>"tasks.json"</em> com o seguinte conteúdo (substitua \<app_name\> pelo mesmo nome do diretório da seu game).

launch.json:

{% highlight json%}
{
  // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "name": ".NET Core Launch (console)",
            "type": "coreclr",
            "request": "launch",
            "preLaunchTask": "build",
            "program": "${workspaceFolder}/bin/Debug/netcoreapp3.1/<app_name>.dll",
            "args": [],
            "cwd": "${workspaceFolder}",
            "console": "internalConsole",
            "stopAtEntry": false
        },
        {
            "name": ".NET Core Attach",
            "type": "coreclr",
            "request": "attach",
            "processId": "${command:pickProcess}"
        }
    ]
}
{% endhighlight %}

tasks.json:

{% highlight json%}
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "build",
            "command": "dotnet",
            "type": "process",
            "args": [
                "build",
                "${workspaceFolder}/<app_name>.csproj",
                "/property:GenerateFullPaths=true",
                "/consoleloggerparameters:NoSummary"
            ],
            "problemMatcher": "$msCompile"
        },
        {
            "label": "publish",
            "command": "dotnet",
            "type": "process",
            "args": [
                "publish",
                "${workspaceFolder}/<app_name>.csproj",
                "/property:GenerateFullPaths=true",
                "/consoleloggerparameters:NoSummary"
            ],
            "problemMatcher": "$msCompile"
        },
        {
            "label": "watch",
            "command": "dotnet",
            "type": "process",
            "args": [
                "watch",
                "run",
                "${workspaceFolder}/<app_name>.csproj",
                "/property:GenerateFullPaths=true",
                "/consoleloggerparameters:NoSummary"
            ],
            "problemMatcher": "$msCompile"
        }
    ]
}
{% endhighlight %}

Mais um arquivo deve ser criado mas desta vez na raiz do projeto <em>"global.json"</em>.

{% highlight json%}
{
    "sdk": {
      "version": "3.1.404",
      "rollForward": "disable"
    }
}
{% endhighlight %}

Um último ajuste que talvez seja necessário deve ser feito no arquivo de <em>"settings"</em> do vscode e aqui eu digo talvez pois não me lembro ao certo quais linhas eu adicionei ao arquivo. De qualquer forma confira se as seguintes linhas estão presentes no arquivo <em>~/Library/Application Support/Code/User/settings.json</em>

{% highlight json%}
"omnisharp.path": "latest",
"omnisharp.useGlobalMono": "never",
"csharp.referencesCodeLens.enabled": false,
{% endhighlight %}

A partir desse ponto basta que você pressione a tecla <em>"F5"</em> ou use o menu run\>start debugging no vscode para fazer o build e debug do seu projeto e ver uma bela tela azul surgir.  

![_config.yml]({{ site.baseurl }}/images/blue_screen.png)

Esse é o ponto de partida para começar a desenvolver jogos com MonoGame. Já fiz esse mesmo setup em Linux e também funciona perfeitamente com algumas poucas mudanças óbvias como por exemplo o gerenciador de pacotes que você irá usar.

Quem sabe eu não voltou aqui para mostrar algumas coisas como por exemplo a criação de sprites.

Caso não queira esperar no meu github tenho alguns pequenos exemplos de jogos caso você queira ver como é estruturado o código no MonoGame.

[Game simples usando tiled](https://github.com/educrod/rpg)

[Exemplo do uso de shaders](https://github.com/educrod/shaders) 