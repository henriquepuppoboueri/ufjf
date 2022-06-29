**osTT Client** is a _Client-side_ responsive theme for the world's most popular customer support ticket system - osTicket.

Compatible with osTicket Core, v1.9.12

### Key Features

osTicket offers stellar functionality but in its out-of-the-box state, does not cater for the whole range of the mobile devices of your customers. **osTT Client** is built using Bootstrap 3 so is robustly responsive to any situation that your support ticket system may be used.

Installation is simple - **osTT Client** can be easily added onto existing osTicket installations using our easy to follow 3-step integration guide. With a small amount of knowledge, it can also be easily extended to be either customised by you or us; [osTicket Themes](http://osticketthemes.com/)

# osTT Client (osTicket v1.9.12) Documentation

## Installation

There are two methods for installing our theme. Which one you use depends on whether you already have osTicket installed.

### Installing a 'Client' side theme as a new installation

If you don't already have an existing osTicket installation, there are no special steps to take in addition to the standard osTicket install process. In your theme's unzipped folder, there is a sub-directory titled `install`.

This is the complete osTicket package and is ready to install on your chosen server, incorporating your chosen theme.

To install osTicket, please refer to [osTicket's Wiki](http://osticket.com/wiki/Main_Page) for a step-by-step guide.

### Installing a 'Client' side theme on an existing installation

Whilst a fairly straightforward task, implementation of an osTicket Theme into an existing osTicket installation must be performed with care as to not overwrite existing configuration. However, by following the simple steps below, you will be themed up in no time!

1.  Backup your existing installation. osTicket Themes cannot accept responsibility for loss of functionality due to an incorrectly completed installation.
2.  Inside your unzipped theme folder, you will find a directory called `existing-install`. Open this.
3.  Replace `index.php` from your current installation's root directory with the `index.php` from within the theme folder.
4.  Copy the directory `osttclient` into the `/assets` directory in your current installation.
5.  Replace the `/include/client` directory in your current installation with the `client` directory in your theme folder.
6.  Relax, you're done.

## Docs

### Files

osTT Client Theme is integrated within the osTicket installation as a whole. We have developed the theme to be as easy to install and maintain as possible.

The theme has modified the core osTicket files:

1.  `root`/index.php
2.  `root`/include/client/`all files in this directory`

In addition, a new directory of files has been created:

1.  `root`/assets/osttclient

### Choosing a colour scheme

osTT Client Theme includes 6 distinct colour schemes. To change the colour scheme:

1.  Open up the file `/include/client/header.inc.php` in your favourite code or text editor.
2.  Look for the comments in the code "Change your colour scheme here."
3.  Underneath this, there is a link to the `'blue-scheme.css'` file. Change this to the colour scheme of your choice from the `/assets/osttclient/css/colours` directory (for example `red-scheme.css`). This should apply the chosen theme to the site.

These colour scheme files contain all the colour information for the Theme. If you want to customise to your requirements, copy one of the .css files in the 'colours' directory, make your own changes and then follow the steps above to link to the correct file. Happy scheming!

### Sass (scss)

If Sass is your thing, we have included all the original Sass files in `root`/assets/osttclient/sass

## Acknowledgements

Thanks to the following:

*   [osTicket (of course!)](http://osticket.com/)
[](http://osticket.com/)
*   [](http://osticket.com/)[Bootstrap](http://getbootstrap.com/)
*   [Flat UI - Design Modo](http://designmodo.com)
*   [FontAwesome](http://fontawesome.io/)

[http://osticketthemes.com/](http://osticketthemes.com/)
